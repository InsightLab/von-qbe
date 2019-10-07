package br.ufc.insightlab.vonqbe.exception

import org.apache.http.HttpStatus


class ErrorFileMessage(status: HttpStatus, message: String, debugMessage : String) extends ApiException{

  //private static final long serialVersionUID = 2472035179836987288L;
  override val serialVersionUID : Long = 2472035179836987288L

//  def this(message : String) {
//    //super(HttpStatus.INTERNAL_SERVER_ERROR, message);
//    super(HttpStatus.SC_INTERNAL_SERVER_ERROR, message)
//  }
  var api : ApiException = new ApiException(status, message, debugMessage)
  var error = HttpStatus.SC_INTERNAL_SERVER_ERROR


}