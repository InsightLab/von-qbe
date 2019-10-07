package br.ufc.insightlab.vonqbe.exception

import java.util.Date

import org.apache.http.HttpStatus

//@JsonIgnoreProperties({ "stackTrace", "cause", "localizedMessage", "suppressed" })
class ApiException(var status: HttpStatus, message: String, var debugMessage : String) extends RuntimeException {

  /**
    *
    */
  //private static final long serialVersionUID = 1L;
  var serialVersionUID : Long = 1L

  /**
    * The status property holds the operation call status.
    * It will be anything from 4xx to signalize client errors or
    * 5xx to mean server errors.
    * A common scenario is a http code 400 that means a BAD_REQUEST,
    * when the client, for example, sends an improperly formatted
    * field, like an invalid email address.
    */
  //private HttpStatus status;

  /**
    * The timestamp property holds the date-time instance of when the error happened.
    */
  //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
  //private Date timestamp;
  var timestamp : Date = new Date()

  /**
    * The message property holds a user-friendly message about the error.
    */
//  //private String message;
//  var message : String

  /**
    * The debugMessage property holds a system message describing the error in more detail.
    */
  //private String debugMessage;

//  def this(status: HttpStatus, message: String, debugMessage : String){
//    this(status, debugMessage)
//
//    var timestamp : Date = new Date()
//
//  }
//
//  def this(status : HttpStatus, message : String) {
//    super(message);
//    this.status = status;
//    this.message = message;
//    this.timestamp = new Date();
//  }

}