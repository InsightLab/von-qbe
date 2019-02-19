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
import org.springframework.web.bind.annotation.*;
import org.apache.jena.query.ResultSet;

import br.ufc.insightlab.vonqbe.repository.VirtuosoRepository;
import br.ufc.insightlab.vonqbe.service.VirtuosoService;



@RestController
public class VirtuosoController {

    private static Logger logger = LoggerFactory.getLogger(VirtuosoController.class);
    //private static String directory = "./von-qbe-databases/";

    VirtuosoService virtuosoService;

    @PostMapping("/uploadLink")
    public void uploadLink(
            @RequestParam("name") String name,
            @RequestParam("baseURI") String baseURI) {

        logger.info("Receiving baseURI {}", baseURI);
        logger.info("Name virtuoso : {}", name);

        try {
            virtuosoService = new VirtuosoService(baseURI);
            ResultSet results = virtuosoService.run("select ?s ?p ?o where{?s ?p ?o} LIMIT 10");
            if (results == null) {
                throw new Exception();
            }
        } catch (Exception e) {
            logger.warn("Failed to load database {}. Error");
        }

        VirtuosoRepository.createVirtuosoRepository(name, baseURI);

    }
}