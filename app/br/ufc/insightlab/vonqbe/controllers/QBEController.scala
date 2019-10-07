package br.ufc.insightlab.vonqbe.controllers
import java.net.{URL, URLDecoder}

import sun.net.www.protocol.http

import scala.collection.mutable
import br.ufc.insightlab.vonqbe.service.{QBEService, VirtuosoService}
import br.ufc.insightlab.vonqbe.repository.{QBERepository, VirtuosoRepository}
import java.io.{File, FileNotFoundException}

import play.Logger
/*import play.api.http.MediaRange.parse*/
import play.api.http.MediaType.parse

import sun.net.www.protocol.http.HttpURLConnection


import scala.reflect.io.File

abstract class QBEController(qbeService : QBEService, qbeRepository : QBERepository, virtuosoRepository: VirtuosoRepository){

  var logger : Logger
  var directory : String = "./von-qbe-databases/"
  var container : mutable.Map[String, QBERepository]
  var virtuosoService : VirtuosoService

  def this(qbeService: QBEService){

    // populating primary constructor
    this(qbeService, null, null)

    // accessing database directory for verification
    //val file : java.io.File = new File(directory)
    val file : java.io.File = new java.io.File(directory)
    val afile : Array[java.io.File] = file.listFiles()

    // listing folders internal to the database directory
    val folders : Array[java.io.File] = new java.io.File(directory).listFiles().filter(_.isDirectory)

    // browsing folders and checking if the database is a virtuous database
    for(fold <- folders) {

      if (new File(fold.getPath + "/databaseinfo.json").exists()) {

        var database = readJSON(fold + "/databaseinfo.json")


        if (validarLink(database.get("url").toString )) {
          virtuosoService.createVirtuosoRepository(database.get("database_name").toString,
                                                        database.get("url").toString,
                                                        database.get("uri").toString,
                                                        fold + "/schema.nt")

//            var virtuoso : VirtuosoRepository = VirtuosoRepository(database.get("database_name"),
//                                              database.get("url"),
//                                              database.get("uri"),
//                                              fold + "/schema.nt")
          //qbeService.createVirtuosoRepository(database.get("database_name"),

        } else {
          var folder: java.io.File = new File(fold.getPath)
          folder.delete()
        }
      }

    }
  }

  /**
    * return a list of databases
    */

  def getDatabases() : collection.Set[String] = {
    var databases : collection.Set[String] = qbeService.getDatabases()
    databases
  }
/**
  // https://www.playframework.com/documentation/2.7.x/ScalaJson
  def readJSON(filePath : String) : Map[String, String] = {

    try {
      val json: String = scala.io.Source.fromFile(filePath).mkString //.toMap[String, String]
      implicit val formats = org.json4s.DefaultFormats
      parse(json).extract[Map[String, String]]

    }
    catch{
      case e : Exception => {???}
    }
  }

  def readJson(filePath : String) : Map[String, String] ={
    val jsonString = scala.io.Source.fromFile(filePath).mkString
    val json = parse(jsonString)
    val elements = (json \\ "databaseinfo").children
    for (acct <- elements) {
      val m = acct.extract[DatabaseInfo]
      println(s"Database: ${m.name}, ${m.baseURI}, ${m.graphURI} ")
    }
  }**/
//  def readJSON(filePath: String): HashMap[String, String] = {
//
//    try {
//      var reader = new FileReader(filePath)
//      var gson: Gson
//      var virtuoso: mutable.HashMap[String, String] = gson.fromJson(reader, mutable.HashMap)
//    } catch {
//      case ex: FileNotFoundException => {
//        // Ocorreu algum erro
//        ???
//      }
//    }
//  }

  def readJSON(str: String) : mutable.Map[String, String]= {
    try{

      val json : String = scala.io.Source.fromFile(str).mkString

      val map : mutable.Map = json.substring(1, json.length - 1)
                          .split(",")
                          .map(_.split(":"))
                          .map { case Array(k, v) => (k.substring(1, k.length-1), v.substring(1, v.length-1))}
                          .toMap
    }
    catch {
      case ex: FileNotFoundException => {
        //        // Ocorreu algum erro
                ???
      }

    }
  }

  /**
    * check if the url entered is valid
    */

  def validarLink(url : String) : Boolean = {

    var output = false

    try {
      var u: URL = new URL(url)
      var CODEResponse = 0
      var huc: HttpURLConnection = u.openConnection().asInstanceOf[http.HttpURLConnection]

      huc.connect()
      CODEResponse = huc.getResponseCode

      if (CODEResponse == 200) {
        output = true
      }

      output

    }
    catch {
      case x : java.io.IOException => {
        //logger.logger.error("Problem with SPARQL Endpoint {}", url)
        false
      }
      //case _: Throwable => ???
    }
  }

  /**
    *
    */

  def decoderText(text : String) : String = {

    var textDecoder = text

    try{
      textDecoder = URLDecoder.decode(text, "UTF-8")
      textDecoder
    }
    catch {
      case x : java.io.IOError => ???
        //logger.logger.info("Exception : ")
    }
  }

  /**
    * generate suggestions to complete the query
    */

  def helper(database : String, text : String) : List[String] = {

    var textDecoder : String = decoderText(text)
    var lista : List[String] = List("")
    //logger.logger.info("database: {}, text: {}", database, textDecoder)

    var service = qbeService

    service match {
      case s: VirtuosoRepository => s
    }
    // se o service for do tipo Virtuoso e tiver esse banco de dados ...
    // ao adicionar mais tipos de base de dados QBE, adicionar mais um condicional
    if(service.isInstanceOf[VirtuosoRepository] && (service.getRepository(database)) != null) {

      //service = VirtuosoService.getRepository(database)
      service.getRepository(database)


      if(service == null){
        //logger.logger.error("Database {} not found!", database)

      }
      else
        lista = service.helper(textDecoder)
    }
    lista
  }

  /**
    * the query will be defined on each type of QBE
    */

  // abstract def query(database : String, text : String, limit : Int, withNER : Boolean) : List[WebResultItem]

}