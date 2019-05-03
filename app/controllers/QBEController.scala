package controllers

import java.io.UnsupportedEncodingException
import java.lang.Exception

import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.QBEService
import java.net.{HttpURLConnection, URL, URLDecoder}

import javax.net.ssl.HttpsURLConnection
import play.api.Logger
//import org.slf4j.LoggerFactory
import repository.QBERepository

import scala.collection.mutable

class QBEController(qbeService : QBEService, qbeRepository : QBERepository)(cc: ControllerComponents) extends AbstractController(cc){

  //var logger : LoggerFactory
  var logger : Logger
  var containers : mutable.Map[String, QBERepository]

  /**
    * Initializes the variable "containers"
    */
  def init(): Unit ={
    var containers = new mutable.HashMap[Nothing]()
  }

  /**
    * Generates suggestions for completing the query
    */
  def helper(database : String, text : String): List[String] = {

    var textDecoder: String = decoderText(text)

    //logger.info("database: {}, text: {}", database, textDecoder)
    if(qbeRepository.getRepository(database) != null) {
      var controler = qbeRepository.getRepository(database)

      if(controler != null) {
        var output = qbeService.helper(text).map(qbeRepository.getRepository(database))
      }
    }

  }

  //def uploadFile: Action = {???}
  /**
    * Mounts the query to be made
    */
  def query(database : String, text : String, limit : Int, withNER : Boolean): Action = {
    logger.info("database : "+database+", text : "+text)
    var textDecoder = decoderText(text)
    qbeRepository.getRepository(database)
  }

  def databases :Unit={
    //new mutable.LinkedList[String](qbeRepository.getDatabases())
    new mutable.LinkedList[String](qbeService.databases())
  }

  def decoderText(text : String): String ={
    var textDecoder = text
        try{
          textDecoder = URLDecoder.decode(text, "UTF-8")
        } //catch(var ex : UnsupportedEncodingException){
        catch(val e : Exception){
          throw new ErrorFileMessage(ex.getCause.getMessage)
        }
  }

  def validarLink(url : String): Boolean ={

    var output : Boolean = false
    var CODEResponse : Int = 0

    try {

      var huc : HttpsURLConnection = (new URL(url)).openConnection().asInstanceOf[HttpsURLConnection]

      huc.setRequestMethod("GET")
      huc.connect()
      CODEResponse = huc.getResponseCode

      if (CODEResponse == 200) {
        logger.info("HTTP Status : " + CODEResponse)
        output = true
      }

      return output
    }
    catch(var e : Exception){
      return false
    }
  }

}