package br.ufc.insightlab.vonqbe.model

import play.api.libs.json.{Format, Json}

case class ReturnVirtuosoUpload (name: String,
                                 baseUri: String,
                                 graphURI: String,
                                 squema: UploadFileResponse){

  override def toString: String = "Virtuoso -------------\n" +
    "name : "+ name + "\n"+
    "baseURI : " + baseUri +"\n"+
    "graphURI : " + graphURI +"\n"+
    "squema : " + squema
}

object ReturnVirtuosoUpload {
  implicit val format: Format[ReturnVirtuosoUpload] = Json.format
}