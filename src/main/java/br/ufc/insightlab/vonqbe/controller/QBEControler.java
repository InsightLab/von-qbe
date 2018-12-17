package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage;
import br.ufc.insightlab.vonqbe.repository.QBERepository;

@RestController
public class QBEControler {

    private static Logger logger = LoggerFactory.getLogger(QBEControler.class);
    private static String directory = "./von-qbe-databases/";

    public QBEControler(){
    	File file = new File(directory);
    	File afile[] = file.listFiles();
    	int i = 0;
    	for (int j = afile.length; i < j; i++) {
    		try {
				File files = afile[i];			
				if (Files.isDirectory(files.toPath())) {
					//String[] nameFiles = listFilesDirectory(directory + files.getName());
					QBERepository.createRepository(files.getName(),
							files+"/mapping.odba",
							files+"/schema.owl",
							files+"/schema.nt");
				}
			}
			catch(Exception e){
    			logger.warn("Failed to load database {}. Error: {}", afile[i].getName(), e.getMessage());
			}
    	}
	}
	
	@RequestMapping(value="/helper", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<String> helper(String database, String text) {
		
		String textDecoder = decoderText(text);
		
		logger.info("database: {}, text: {}",database, textDecoder);
		QBERepository controler = QBERepository.getRepository(database);

		if(controler == null){
			logger.error("Database {} not found!");
			return new LinkedList<>();
		}
		else{
			return controler.helper(textDecoder);
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
	
	/*private  String[] listFilesDirectory( String diretorio ) {
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
	}*/
	
	
	protected String decoderText( String text) {
		String textDecoder = text;
		try {
			textDecoder = URLDecoder.decode(text, "UTF-8");
		} catch (UnsupportedEncodingException ex) {
			// TODO Auto-generated catch block
			 throw new ErrorFileMessage(ex.getCause().getMessage());
		}
		
		return textDecoder;
		
	}
	
	
}
