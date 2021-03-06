package br.ufc.insightlab.vonqbe.controller;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.vonqbe.exception.HttpVirtuosoException;
import br.ufc.insightlab.vonqbe.model.ReturnVirtuosoUpload;
import br.ufc.insightlab.vonqbe.model.UploadFileResponse;
import br.ufc.insightlab.vonqbe.repository.VirtuosoRepository;
import br.ufc.insightlab.vonqbe.service.FileStorageService;
import br.ufc.insightlab.vonqbe.service.VirtuosoService;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.*;

@RestController
public class VirtuosoController {

    private static Logger logger = LoggerFactory.getLogger(VirtuosoController.class);
    private static String directory = "./von-qbe-databases/";
    //private  String directory = super.directory;

    QBEControler qbe = new QBEControler();

    VirtuosoService virtuosoService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/uploadLink")
    public ReturnVirtuosoUpload uploadLink(
            @RequestParam("name") String name,
            @RequestParam("linkURL") String linkURL,
            @RequestParam("baseURI") String baseURI,
            @RequestParam("squema") MultipartFile squema) throws IOException {

        logger.info("Name virtuoso : {}", name);
        logger.info("Receiving linkURL {}", linkURL);
        logger.info("Receiving baseURI {}", baseURI);

        String fileNameFile2 = nameFile(squema);
        logger.info("Receiving file {}",fileNameFile2);
        String fileDownloadUri2 = uriFile( name, fileNameFile2 );


        ReturnVirtuosoUpload retorno =  new ReturnVirtuosoUpload();


        if(qbe.validarLink(linkURL)){
            /* Name database*/
            retorno.setName(name);
            retorno.setLinkURL(linkURL);
            retorno.setBaseURI(baseURI);

            /* File2 */
            if(fileNameFile2.endsWith(".nt")) {
                retorno.setSquema(new UploadFileResponse("schema.nt", fileDownloadUri2,
                        squema.getContentType(), squema.getSize()));
                changeDirecotryFile(squema, name, "schema.nt");


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
                retorno.setSquema(new UploadFileResponse("schema.owl", fileDownloadUri2,
                        squema.getContentType(), squema.getSize()));
                changeDirecotryFile(squema, name, "schema.owl");

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
                virtuosoService = new VirtuosoService(linkURL, baseURI);
                String newsparql = insertFromOnSPARQL("select ?s ?p ?o where{?s ?p ?o} LIMIT 10", baseURI);
                //Iterable<ResultQuery> results = virtuosoService.run("select ?s ?p ?o where{?s ?p ?o} LIMIT 10");
                Iterable<ResultQuery> results = virtuosoService.run(newsparql);
                if (results == null) {
                    throw new Exception();
                }
            } catch (Exception e) {
                logger.warn("Failed to load database {}. Error");
            }


            try {
                VirtuosoRepository.createVirtuosoRepository(name,
                        /*linkURL*/
                        linkURL,
                        /*baseURI*/
                        baseURI,
                        /*Schema*/
                        directory + name + "/schema.nt");
                createJSON(name,linkURL,baseURI);

                return retorno;
            } catch (Exception e){
                FileSystemUtils.deleteRecursively(new File(directory+name));
                throw e;
            }
        }
        else{
            throw new HttpVirtuosoException("Invalid SPARQL Endpoint! Input a valid one.");
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

    private static String insertFromOnSPARQL(String sparql, String uri) {
        int idx = sparql.toLowerCase().indexOf("where");

        return sparql.substring(0, idx) + "from <"+uri+"> "+sparql.substring(idx);
    }

    public void createJSON(String name, String url, String uri) {
        //Cria um Objeto JSON
        JSONObject obj = new JSONObject();

        FileWriter writeFile = null;

        //Armazena dados em um Objeto JSON
        obj.put("database_name",name);
        obj.put("url", url);
        obj.put("uri", uri);

        //serializa para uma string e imprime
        String json_string = obj.toString();

        try {
            writeFile = new FileWriter(directory + name + "/databaseinfo.json");
            //Escreve no arquivo conteudo do Objeto JSON
            writeFile.write(obj.toString());
            writeFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


}