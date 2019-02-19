package br.ufc.insightlab.vonqbe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.jena.query.*;

public class VirtuosoService{

    private static Logger logger = LoggerFactory.getLogger(VirtuosoService.class);
    private String link;

    public VirtuosoService(String link) {
        this.link = link;
    }

    public ResultSet run(String sparql) {

        Query query = QueryFactory.create(sparql);
        QueryExecution qexec = QueryExecutionFactory.sparqlService(link, query);
        ResultSet results = qexec.execSelect();

        return results;
    }


}