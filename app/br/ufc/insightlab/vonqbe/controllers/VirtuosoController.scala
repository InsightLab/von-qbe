package br.ufc.insightlab.vonqbe.controllers

import java.io.{File, FileInputStream, FileNotFoundException, FileReader}
import java.net.{HttpURLConnection, URL, URLDecoder}
import java.nio.file.{Files, Path, Paths}

import akka.http.scaladsl.model.HttpHeader.ParsingResult.Ok
import br.ufc.insightlab.ror.entities.ResultQuery
import br.ufc.insightlab.vonqbe.model.ReturnVirtuosoUpload
import play.api.libs.json._
import com.google.gson.Gson
import play.api.Logger

import scala.collection.mutable
import br.ufc.insightlab.vonqbe.service.{QBEService, VirtuosoService}
import br.ufc.insightlab.vonqbe.service.QBEService
import org.neo4j.cypher.internal.frontend.v2_3.replace
//import play.api.http.MediaRange.parse

import play.api.mvc.{MultipartFormData, Action, Request, BodyParsers}

import scala.io.Source

class VirtuosoController (qbeService : QBEService, virtuosoService : VirtuosoService){

  var directory : String = "./von-qbe-databases/"

  var parse = BodyParsers.parse

  var logger : Logger

  /**
   *
   */
  def uploadLink(): Action[JsValue] = Action(parse.json) { request =>

    val info = request.body.as[ReturnVirtuosoUpload]
    val input = new FileInputStream()
    input.read()

//       info.squema
//        .moveFileTo( Paths.get(squema).toFile, replace = true)
//
//      logger.logger.info("Name Virtuoso : {}", name)
//      logger.logger.info("Receiving BaseURI : {}", baseURI)
//      logger.logger.info("Receiving GraphURI : {}", graphURI)
//
//      //var fileNameFile2 = nameFile(squema)
//      //var fileNameFile2 = Path.getFileName(squema)
//      //var fileNameFile2 = squema.getFileName()
//
//
//
//
//      logger.logger.info("Receiving file {}", fileNameFile2)
  }


  /*
  def uploader = Action(parse.multipartFormData) { implicit request =>
    request.body.file("file").map { picture =>
      picture.ref.moveTo(Paths.get(s"/Users/Alexis/Downloads/"+picture.filename).toFile, replace = true)
      Ok("File upload successful")
    }.getOrElse {
      Redirect(routes.FileUploadController.index).flashing(
        "error" -> "File not found")
    }
  }*/

  /*
    def upload = Action(parse.multipartFormData) { request =>
    request.body
      .file("picture")
      .map { picture =>
        // only get the last part of the filename
        // otherwise someone can send a path like ../../home/foo/bar.txt to write to other files on the system
        val filename    = Paths.get(picture.filename).getFileName
        val fileSize    = picture.fileSize
        val contentType = picture.contentType

        picture.ref.copyTo(Paths.get(s"/tmp/picture/$filename"), replace = true)
        Ok("File uploaded")
      }
      .getOrElse {
        Redirect(routes.HomeController.index).flashing("error" -> "Missing file")
      }
    }
   */


  /**
   *
   */
  def creatJSON(name : String, baseURI : String, graphURI : String): Unit = {???}

  /**
   *
   */
  // TODO achar o tipo que suporte arquivo em scala
  def changeDirectoryFile(file:Source , folder : String, newFileName : String): Unit ={???}

  /**
   *
   */
  def insertFromOnSPARQL(sparql : String, uri : String) : String = {???}

  /**
   *
   */
  def createVirtuosoRepository(name : String, baseURI : String, graphURI : String, ntPath : String) = {
    virtuosoService.createVirtuosoRepository(name, baseURI, graphURI, ntPath)
  }

  /**
   *
   */
  def run (sparql : String) : Iterable[ResultQuery] = {
    virtuosoService.run(sparql)
  }

  /**
   *
   */
  def applyQuery(sparql : String) : Iterable[ResultQuery] = {
    virtuosoService.applyQuery(sparql)
  }

}