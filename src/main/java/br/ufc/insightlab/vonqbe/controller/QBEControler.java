package br.ufc.insightlab.vonqbe.controller;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import br.ufc.insightlab.vonqbe.repository.VirtuosoRepository;
import com.google.gson.Gson;

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

					if(new File(files.getPath()+"/mapping.odba").exists()){
						ODBAQBERepository.createODBAQBERepository(files.getName(),
							files+"/mapping.odba",
							files+"/schema.owl",
							files+"/schema.nt");
					}
					else if(new File(files.getPath()+"/databaseinfo.json").exists()){
						HashMap<String,String> database = readJSON(files+"/databaseinfo.json");

						if(validarLink(database.get("url"))) {

							VirtuosoRepository.createVirtuosoRepository(database.get("database_name"),
									database.get("url"),
									database.get("uri"),
									files + "/schema.nt");
						}
						else{
							File folder = new File(files.getPath());
							folder.delete();
						}
					}
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
	public List<WebResultItem> query(String database, String text, int limit, boolean withNER) throws Exception{
		
		logger.info("database: {}, text: {}",database, text);
		String textDecoder= decoderText(text);
		QBERepository controler = ODBAQBERepository.getRepository(database);
		if(controler == null){
			logger.error("Database {} not found!");
			return new LinkedList<>();
		}
		else{
			return controler.runQuery(textDecoder, limit, withNER);
		}

	}
	
	
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


	public HashMap<String,String> readJSON(String filePath) throws FileNotFoundException {

		//File filePath = new File(path);
		Reader reader = new FileReader(filePath);

		Gson gson = new Gson();

		HashMap<String,String> virtuoso = gson.fromJson(reader, HashMap.class);

		return virtuoso;
	}


	public boolean validarLink(String url) throws IOException {

		boolean output = false;

		try{
			URL u = new URL(url);
			int CODEResponse = 0;
			HttpURLConnection huc = (HttpURLConnection) u.openConnection();
			huc.setRequestMethod("GET");
			huc.connect();
			CODEResponse = huc.getResponseCode();

			if (CODEResponse == 200) {
				logger.info("HTTP Status : "+CODEResponse);
				output = true;
			}
			return output;
		}
		catch(Exception e){
			logger.error("Problem with SPARQL Endpoint {}");
			return false;
		}



	}
}
