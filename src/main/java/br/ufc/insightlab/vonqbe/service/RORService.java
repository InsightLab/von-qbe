package br.ufc.insightlab.vonqbe.service;

import br.ufc.insightlab.ror.entities.ResultQuerySet;

public interface RORService {
	
	//ResultQuerySet run(String sparql) throws Exception;
	ResultQuerySet run(String sparql) throws Exception;
}
