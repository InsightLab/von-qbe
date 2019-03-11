package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.util.LinkedList;
import java.util.List;

import br.ufc.insightlab.vonqbe.repository.VirtuosoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage;
import br.ufc.insightlab.vonqbe.repository.ODBAQBERepository;
import br.ufc.insightlab.vonqbe.repository.QBERepository;

@RestController
public class QBEControler {

    private static Logger logger = LoggerFactory.getLogger(QBEControler.class);
    public static String directory = "./von-qbe-databases/";

    public QBEControler(){
    	File file = new File(directory);
    	File afile[] = file.listFiles();
    	int i = 0;
    	for (int j = afile.length; i < j; i++) {
    		try {
				File files = afile[i];			
				if (Files.isDirectory(files.toPath())) {
					//String[] nameFiles = listFilesDirectory(directory + files.getName());
					ODBAQBERepository.createODBAQBERepository(files.getName(),
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

	//TODO adaptar essa função para o tipo virtuoso
	// como verificar se o banco é do tipo ODBA ou Virtuoso ???
	// função p/ listar os bancos criados

	@RequestMapping(value="/helper", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<String> helper(String database, String text) {
		
		String textDecoder = decoderText(text);
		
		logger.info("database: {}, text: {}",database, textDecoder);
		QBERepository controler;

		if(ODBAQBERepository.getRepository(database) != null){
			controler = ODBAQBERepository.getRepository(database);

			if(controler == null){
				logger.error("Database {} not found!");
				return new LinkedList<>();
			}
			else{
				return controler.helper(textDecoder);
			}
		}
		else if (VirtuosoRepository.getRepository(database) != null){
			controler = VirtuosoRepository.getRepository(database);

			if(controler == null){
				logger.error("Database {} not found!");
				return new LinkedList<>();
			}
			else{
				return controler.helper(textDecoder);
			}
		}
		return null;
	}

	@RequestMapping(value="/databases", method= RequestMethod.GET)
	public List<String> getDatabases(){
    	return new LinkedList<>(QBERepository.getDatabases());
	}
	
	@RequestMapping("/query")
	public List<WebResultItem> query(String database, String text, int limit) throws Exception{
		
		logger.info("database: {}, text: {}",database, text);
		String textDecoder= decoderText(text);
		QBERepository controler = ODBAQBERepository.getRepository(database);
		if(controler == null){
			logger.error("Database {} not found!");
			return new LinkedList<>();
		}
		else{
			return controler.runQuery(textDecoder, limit);
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
