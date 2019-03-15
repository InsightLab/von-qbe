package br.ufc.insightlab.vonqbe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.jena.query.*;

import java.util.Iterator;

public class VirtuosoService{

    private static Logger logger = LoggerFactory.getLogger(VirtuosoService.class);
    private String link;
    private String uri;

    public VirtuosoService(String link, String uri) {
        this.link = link;
        this.uri = uri;
    }

    //public ResultSet run(String sparql) {
    public Iterator<QuerySolution> run(String sparql){

        // ResultSet é um Iterator<QuerySolution>
        Query query = QueryFactory.create(sparql);
        QueryExecution qexec = QueryExecutionFactory.sparqlService(link, query);
        //ResultSet results = qexec.execSelect();
        Iterator<QuerySolution> results = qexec.execSelect();

        return results;
    }


}