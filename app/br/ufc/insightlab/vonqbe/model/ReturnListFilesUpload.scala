package br.ufc.insightlab.vonqbe.model

import play.api.libs.json.{Format, Json}

class ReturnListFilesUpload(var name : String, var file1 : UploadFileResponse, var file2 : UploadFileResponse) {

  override def toString: String = "FILES ------------\n"+
    "name : " +name +"\n"+
    "file1 : " +file1+"\n"+
    "file2 : " +file2

  implicit val format : Format[ReturnListFilesUpload] = Json.format[ReturnListFilesUpload]

}