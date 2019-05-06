package scala.br.ufc.insightlab.vonqbe.model

import play.api.libs.json.{Format, Json}

class ReturnVirtuosoUpload (var name:String,var baseUri : String, var graphURI : String, var squema : UploadFileResponse){

  override def toString: String = "Virtuoso -------------\n" +
    "name : "+ name + "\n"+
    "baseURI : " + baseUri +"\n"+
    "graphURI : " + graphURI +"\n"+
    "squema : " + squema

  implicit val format : Format[ReturnVirtuosoUpload] = Json.format[ReturnVirtuosoUpload]
}