package br.ufc.insightlab.vonqbe.model

import play.api.libs.json.{Format, Json}

case class UploadFileResponse(fileName: String,
                              fileDownloadURI: String,
                              fileType: String,
                              size: Long) {

  override def toString: String = "UploadFileResponse -------\n"+
    "file name : "+fileName+"\n"+
    "file Download URI : "+fileDownloadURI+"\n"+
    "fileType : "+fileType
}

object UploadFileResponse {
  implicit val format: Format[UploadFileResponse] = Json.format
}