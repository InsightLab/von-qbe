package scala.br.ufc.insightlab.vonqbe.model

import play.api.libs.json.{Format, Json}

class UploadFileResponse(var fileName : String, var fileDownloadURI : String, var fileType : String, var size : Long) {

  override def toString: String = "UploadFileResponse -------\n"+
    "file name : "+fileName+"\n"+
    "file Download URI : "+fileDownloadURI+"\n"+
    "fileType : "+fileType

  implicit val format : Format[UploadFileResponse] = Json.format[UploadFileResponse]

}
