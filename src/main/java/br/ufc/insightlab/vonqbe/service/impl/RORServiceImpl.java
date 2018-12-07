package br.ufc.insightlab.vonqbe.service.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.ror.entities.ResultQuerySet;
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
	
	public RORServiceImpl(String obda, String owl) {
		try {
            logger.info("[ROR API] Arquivo OWL: {}", owl);

            logger.info("[ROR API] Arquivo obda: {}", obda);

			this.ror = new OntopROR(owl, obda);
			logger.info("[ROR API] Mapeamentos carregados com sucesso!");
		} catch (Exception e) {
			logger.error(e.getMessage());
			System.out.println(e);
		}
	}

	@Override
	public ResultQuerySet run(String sparql) throws Exception{
		return this.ror.runQuery(sparql);
	}
}