package br.ufc.insightlab.vonqbe.service.impl;


import br.ufc.insightlab.ror.entities.ResultQuerySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.ror.implementations.OntopROR;
import br.ufc.insightlab.vonqbe.service.RORService;


/**
 * 
 * @author araujodavid
 * @since 08/02/2018
 */
//@Component
//@ApplicationScoped
public class RORServiceImpl implements RORService {

	private static Logger logger = LoggerFactory.getLogger(RORServiceImpl.class);

	private OntopROR ror;
	
	public RORServiceImpl(String obda, String owl) throws Exception{

            logger.info("[ROR API] OWL file: {}", owl);

            logger.info("[ROR API] OBDA file: {}", obda);

			this.ror = new OntopROR(owl, obda);
			logger.info("[ROR API] Mappings loaded successfully!");
		
	}

	@Override
	public ResultQuerySet run(String sparql) throws Exception{
		return this.ror.runQuery(sparql);
	}
}