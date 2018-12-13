package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.repository.QBERepository;

@RestController
public class QBEControler {

    private static Logger logger = LoggerFactory.getLogger(QBEControler.class);
    private static String diretorio = "./von-qbe-databases/";

    public QBEControler(){
    	File file = new File(diretorio);
    	File afile[] = file.listFiles();
    	int i = 0;
    	for (int j = afile.length; i < j; i++) {
    		File arquivos = afile[i];
    		String[] nameFiles = listFilesDirectory(diretorio+arquivos.getName());
    		QBERepository.createRepository(arquivos.getName(), nameFiles[0], nameFiles[1], nameFiles[2]);
    	}
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

	@RequestMapping(value="/databases", method= RequestMethod.GET)
	public List<String> getDatabases(){
    	return new LinkedList<>(QBERepository.getDatabases());
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
	
	private  String[] listFilesDirectory( String diretorio ) {
		String[] retorno = new String[3];
		File file = new File(diretorio);
    	File afile[] = file.listFiles();
    	int i = 0;
    	for (int j = afile.length; i < j; i++) {
    		File arquivos = afile[i];
    		retorno[i] = diretorio+"/"+arquivos.getName();
    		//System.out.println();
       	}
		return retorno;
	}
	
	
}
