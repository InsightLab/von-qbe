package br.ufc.insightlab.vonqbe.exception;

import java.util.Date;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({ "stackTrace", "cause", "localizedMessage", "suppressed" })
public class ApiException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * The status property holds the operation call status. 
	 * It will be anything from 4xx to signalize client errors or 
	 * 5xx to mean server errors. 
	 * A common scenario is a http code 400 that means a BAD_REQUEST, 
	 * when the client, for example, sends an improperly formatted 
	 * field, like an invalid email address.
	 */
	private HttpStatus status;
	
	/**
	 * The timestamp property holds the date-time instance of when the error happened.
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
	private Date timestamp;
	
	/**
	 * The message property holds a user-friendly message about the error.
	 */
	private String message;
	
	/**
	 * The debugMessage property holds a system message describing the error in more detail.
	 */
	private String debugMessage;
	
	public ApiException(HttpStatus status, String message, String debugMessage) {
		super(message);
		this.status = status;
		this.message = message;
		this.debugMessage = debugMessage;
		this.timestamp = new Date();
	}
	
	public ApiException(HttpStatus status, String message) {
		super(message);
		this.status = status;
		this.message = message;
		this.timestamp = new Date();
	}
	
	public HttpStatus getStatus() {
		return status;
	}
	
	public void setStatus(HttpStatus status) {
		this.status = status;
	}
	
	public Date getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getDebugMessage() {
		return debugMessage;
	}
	
	public void setDebugMessage(String debugMessage) {
		this.debugMessage = debugMessage;
	}
	
}
