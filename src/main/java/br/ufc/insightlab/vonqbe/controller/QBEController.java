package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import br.ufc.insightlab.vonqbe.service.impl.DummyRORServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.QBEService;
import br.ufc.insightlab.vonqbe.service.RORService;
import br.ufc.insightlab.vonqbe.service.impl.QBEServiceImpl;
import br.ufc.insightlab.vonqbe.service.impl.RORServiceImpl;

@RestController
public class QBEController {

	private class Dummy {
		public String nome = "nome";
		public int id = 1;
	}
	
	private QBEService qbeService = new QBEServiceImpl();
//	private RORService rorService = new RORServiceImpl();
	private RORService rorService = new DummyRORServiceImpl();

    private static Logger logger = LoggerFactory.getLogger(QBEController.class);
	
	@RequestMapping(value="/home", method = RequestMethod.GET)
	public String home(String a, String b) {
		return a+" / "+b;
	}
	
	@RequestMapping(value="/dummy", method = RequestMethod.GET)
	public Dummy dummy() {
		return new Dummy();
	}
	
	@RequestMapping(value="/helper", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<String> helper(String text) {
		logger.info("text: {}",text);	
		return this.qbeService.helper(text);
	}
	
	@RequestMapping("/query")
	public List<WebResultItem> query(String text) {
		logger.info("text: {}",text);
		String sparql;
		try {
			sparql = this.qbeService.query(text) + " LIMIT 30";
		} catch (ArrayIndexOutOfBoundsException e) {
			return new ArrayList<WebResultItem>();
		}
		logger.info(sparql);
		try {
			
			ResultQuerySet results = this.rorService.run(sparql);
			
			List<WebResultItem> resultsList = new LinkedList<WebResultItem>();
			
			for(ResultQuery r : results)
				resultsList.add(new WebResultItem(r));
			
			System.out.println(resultsList);
			
			logger.info("Retornando {} resultados", resultsList.size());
//			this.result.use(Results.json()).from(resultsList).recursive().serialize();
			return resultsList;
		} catch (Exception e) {
			logger.error(e.toString());
			//this.result.use(Results.json()).from(e).recursive().serialize();
			return new ArrayList<WebResultItem>();
		}
	}
	
}
