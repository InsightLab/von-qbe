package br.ufc.insightlab.vonqbe.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.ufc.insightlab.vonqbe.model.ReturnListFilesUpload;
import br.ufc.insightlab.vonqbe.model.UploadFileResponse;
import br.ufc.insightlab.vonqbe.repository.QBERepository;
import br.ufc.insightlab.vonqbe.service.FileStorageService;

@RestController
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/uploadFile")
    public ReturnListFilesUpload uploadFile(
    		String name, 
    		@RequestParam("file1") MultipartFile file1, 
    		@RequestParam("file2") MultipartFile file2,
    		@RequestParam("file3") MultipartFile file3) {
    	
    
        String fileNameFile1 = nameFile(file1);
        String fileDownloadUri1 = uriFile( name, fileNameFile1 ); 
        
        String fileNameFile2 = nameFile(file2);
        String fileDownloadUri2 = uriFile( name, fileNameFile2 ); 
        
        String fileNameFile3 = nameFile(file3);
        String fileDownloadUri3 = uriFile( name, fileNameFile3 ); 
        
        
        ReturnListFilesUpload retorno =  new ReturnListFilesUpload();
        
        /* Name database*/
        retorno.setName(name);
        
    	/*File 1*/
        retorno.setFile1( new UploadFileResponse(fileNameFile1, fileDownloadUri1,
        		file1.getContentType(), file1.getSize()));
        
        /* File2 */
        retorno.setFile2( new UploadFileResponse(fileNameFile2, fileDownloadUri2,
        		file2.getContentType(), file2.getSize()));
        
        /* File3 */
        retorno.setFile3( new UploadFileResponse(fileNameFile3, fileDownloadUri3,
        		file3.getContentType(), file3.getSize()));


        changeDirecotryFile(file1, name);
        changeDirecotryFile(file2, name);
        changeDirecotryFile(file3, name);
        
        String home = "./von-qbe-databases/" + name +"/";
        QBERepository.createRepository(name,
        		/*Mapping*/
				home+file1.getOriginalFilename(),
				/*Ontologia*/
				home+file2.getOriginalFilename(),
				/*Schema*/
				home+file3.getOriginalFilename());
    
        
 
        return retorno;
        
    }

    /*@PostMapping("/uploadMultipleFiles")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file ,""))
                .collect(Collectors.toList());
    }*/

    /*@GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }*/
    
    public String nameFile( MultipartFile file) {
    	return fileStorageService.storeFile(file);
    }
    
    public String uriFile( String name, String fileName ) {
    	return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/von-qbe-databases/" + name + "/")
                .path(fileName)
                .toUriString();
    }
    
    public void changeDirecotryFile(MultipartFile file, String name) {
    	 // copia os dados
        InputStream in;
        // escreve os dados
        OutputStream out;
    	try{
			 
		    File toFile = new File("./von-qbe-databases/"+file.getOriginalFilename());
		 
		                File fromFile = new File("./von-qbe-databases/" + name +"/" + file.getOriginalFilename());
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
