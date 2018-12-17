package br.ufc.insightlab.vonqbe.exception;

import org.springframework.http.HttpStatus;

public class ErrorFileMessage extends ApiException {

	private static final long serialVersionUID = 2472035179836987288L;

	public ErrorFileMessage( String message) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, message);
	}
}