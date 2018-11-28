package org.insightlab.vonqbe.service;

import java.util.List;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;

public interface RORService {
	
	ResultQuerySet run(String sparql) throws Exception;
}
