package br.ufc.insightlab.vonqbe.exception;

import org.springframework.http.HttpStatus;

public class HttpVirtuosoException extends ApiException {

    public HttpVirtuosoException(String msg) {
        super(HttpStatus.CONFLICT, msg);
    }
}
