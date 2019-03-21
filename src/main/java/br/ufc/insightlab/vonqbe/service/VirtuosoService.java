package br.ufc.insightlab.vonqbe.service;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.jena.query.*;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class VirtuosoService{

    private static Logger logger = LoggerFactory.getLogger(VirtuosoService.class);
    private String link;
    private String uri;

    public VirtuosoService(String link, String uri) {
        this.link = link;
        this.uri = uri;
    }

    // TODO o erro ta aqui
    public Iterable<ResultQuery> run(String sparql) {
    //public Iterator<QuerySolution> run(String sparql){

        // ResultSet é um Iterator<QuerySolution>
        Query query = QueryFactory.create(sparql);
        QueryExecution qexec = QueryExecutionFactory.sparqlService(link, query);
        ResultSet results = qexec.execSelect();

        List<ResultQuery> rs = new LinkedList<>();

        int i = 0;
        while(results.hasNext()){
            QuerySolution sol = results.next();
            ResultQuery result = new ResultQuery(++i);

            Iterator<String> vars = sol.varNames();
            while(vars.hasNext()){
                String var = vars.next();
                result.addValue(var,sol.get(var).toString());
            }

            rs.add(result);
        }

        return rs;
    }


}