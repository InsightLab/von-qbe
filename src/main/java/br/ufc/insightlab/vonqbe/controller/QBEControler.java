package br.ufc.insightlab.vonqbe.controller;

import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;

@RestController
public class QBEControler {

    private static Logger logger = LoggerFactory.getLogger(QBEControler.class);
    private static String home = System.getProperty("user.home")+"/";

    public QBEControler(){
    	QBERepository.createRepository("imdb",
				home+"mapping.odba",
				home+"ontologiaXML.owl",
				home+"schema.nt");
	}
	
	@RequestMapping(value="/helper", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<String> helper(String database, String text) {
		logger.info("database: {}, text: {}",database, text);
		QBERepository controler = QBERepository.getRepository(database);

		if(controler == null){
			logger.error("Database {} not found!");
			return new LinkedList<>();
		}
		else{
			return controler.helper(text);
		}
	}
	
	@RequestMapping("/query")
	public List<WebResultItem> query(String database, String text) {
		logger.info("database: {}, text: {}",database, text);
		QBERepository controler = QBERepository.getRepository(database);

		if(controler == null){
			logger.error("Database {} not found!");
			return new LinkedList<>();
		}
		else{
			return controler.runQuery(text);
		}

	}
}
