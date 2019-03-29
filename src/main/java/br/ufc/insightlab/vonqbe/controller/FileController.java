package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufc.insightlab.vonqbe.model.ReturnListFilesUpload;
import br.ufc.insightlab.vonqbe.model.UploadFileResponse;
import br.ufc.insightlab.vonqbe.repository.ODBAQBERepository;
import br.ufc.insightlab.vonqbe.service.FileStorageService;

@RestController
public class FileController {

	private static Logger logger = LoggerFactory.getLogger(FileController.class);

	private static String directory = "./von-qbe-databases/";
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/uploadFile")
    public ReturnListFilesUpload uploadFile(
    		@RequestParam("name") String name, 
    		@RequestParam("file1") MultipartFile file1, 
    		@RequestParam("file2") MultipartFile file2)
    {
    	
        String fileNameFile1 = nameFile(file1);
        logger.info("Receiving file {}",fileNameFile1);
        String fileDownloadUri1 = uriFile( name, fileNameFile1 ); 
        
        String fileNameFile2 = nameFile(file2);
		logger.info("Receiving file {}",fileNameFile2);
        String fileDownloadUri2 = uriFile( name, fileNameFile2 );
        
        
        ReturnListFilesUpload retorno =  new ReturnListFilesUpload();
        
        /* Name database*/
        retorno.setName(name);
        
    	/*File 1*/
        retorno.setFile1( new UploadFileResponse("mapping.odba", fileDownloadUri1,
        		file1.getContentType(), file1.getSize()));

        changeDirecotryFile(file1, name, "mapping.odba");

		/* File2 */
        if(fileNameFile2.endsWith(".nt")) {
			retorno.setFile2(new UploadFileResponse("schema.nt", fileDownloadUri2,
					file2.getContentType(), file2.getSize()));
			changeDirecotryFile(file2, name, "schema.nt");


			Model model = ModelFactory.createDefaultModel();
			model.read(directory+name+"/schema.nt","NT");
			try {
				model.write(new FileOutputStream(new File(directory+name+"/schema.owl")), "RDF/XML");
			}
			catch(Exception e){
				e.printStackTrace();
			}
		}
        else {
			retorno.setFile2(new UploadFileResponse("schema.owl", fileDownloadUri2,
					file2.getContentType(), file2.getSize()));
			changeDirecotryFile(file2, name, "schema.owl");

			Model model = ModelFactory.createDefaultModel();
			model.read(directory+name+"/schema.owl","RDF/XML");
			try {
				model.write(new FileOutputStream(new File(directory+name+"/schema.nt")), "NT");
			}
			catch(Exception e){
				e.printStackTrace();
			}
		}

		try {
			ODBAQBERepository.createODBAQBERepository(name,
					/*Mapping*/
					directory + name + "/mapping.odba",
					/*Ontologia*/
					directory + name + "/schema.owl",
					/*Schema*/
					directory + name + "/schema.nt");


			return retorno;
		} catch (Exception e){
			FileSystemUtils.deleteRecursively(new File(directory+name));
        	throw e;
		}
   
    }

    
    private String nameFile( MultipartFile file) {
    	return fileStorageService.storeFile(file);
    }
    
    private String uriFile( String name, String fileName ) {
    	return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/von-qbe-databases/" + name + "/")
                .path(fileName)
                .toUriString();
    }
    
    	
    private void changeDirecotryFile(MultipartFile file, String folder, String newFileName) {
    	 // copy
        InputStream in;
        // write
        OutputStream out;
    	try{
			 
		    File toFile = new File("./von-qbe-databases/"+file.getOriginalFilename());
		
		    File fromFile = new File("./von-qbe-databases/" + folder +"/" + newFileName);
		    //validation 
		    if(!fromFile.exists()){
		        if(!fromFile.getParentFile().exists()){
		            fromFile.getParentFile().mkdir();
		        }
		        fromFile.createNewFile();
		    }
		    
		    in = new FileInputStream(toFile);
		    out = new FileOutputStream(fromFile);
		    // buffer
		    byte[] buffer = new byte[1024];
		    int length;
		   //read
		    while((length = in.read(buffer)) > 0 ){
		        //write new file
		        out.write(buffer, 0 , length);
		    }
		
		    in.close();
		    out.close();
		    //delete file
		    toFile.delete();
		
		}catch(IOException e){
		    e.printStackTrace();
		}     	
    }

}
