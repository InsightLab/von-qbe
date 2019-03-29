package br.ufc.insightlab.vonqbe.service;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.vonqbe.exception.HttpVirtuosoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.jena.query.*;

import java.io.IOException;
import java.net.HttpURLConnection;
//import java.net.MalformedURLException;
//import java.net.ProtocolException;
import java.net.URL;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;

public class VirtuosoService{

    private static Logger logger = LoggerFactory.getLogger(VirtuosoService.class);
    private String link;
    private String uri;

    public VirtuosoService(String link, String uri) {
            this.link = link;
            this.uri = uri;

    }

    public Iterable<ResultQuery> run(String sparql) {

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