package br.ufc.insightlab.vonqbe.repository;

import java.util.*;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.VirtuosoService;

public class VirtuosoRepository extends QBERepository{

    Logger logger = LoggerFactory.getLogger(VirtuosoRepository.class);
    private String link;
    private String uri;
    VirtuosoService virtuosoService;

    public VirtuosoRepository(String name, String linkURL, String baseURI, String ntPath){
        super(ntPath);
        this.link = linkURL;
        this.uri = baseURI;
        virtuosoService = new VirtuosoService(linkURL, baseURI);
        insertRepository(name, this);
    }

    public static QBERepository createVirtuosoRepository(String name, String linkURL, String baseURI, String ntPath) {
        return new VirtuosoRepository(name, linkURL, baseURI, ntPath);
    }



    // applyQuery nn é uma função Iterable<Object> e sim QuerySolution
    // apply query retorna virtuosoService.run(sparql) mas run do service é ResultSet
    // tem q mudar no service tmb

//    public ResultQuerySet applyQuery(String sparql) {
//    //public Iterator<QuerySolution> applyQuery(String sparql) throws  Exception{
//        //QuerySolution
//        //return (Iterable<Object>) virtuosoService.run(sparql);
//        return virtuosoService.run(sparql);
//    }

    public Iterable<ResultQuery> applyQuery(String sparql){

        try {
            //ResultQuery iterator = virtuosoService.run(sparql);
            Iterable<ResultQuery> rs = virtuosoService.run(sparql);
            return rs;
        } catch (Exception e) {
            logger.error(e.toString());
            //return new ResultQuery(-1);
            return new ResultQuerySet(null,null);
        }
    }

//    public List<WebResultItem> mapResults(ResultQuery results){
//        List<WebResultItem> resultsList = new LinkedList<>();
//
//        int i = 1;
//
//        for(String k : results.getProjections()){
//            ResultQuery rs = new ResultQuery(i);
//            rs.addValue(k, results.getValue(k));
//            resultsList.add(new WebResultItem(rs));
//            i++;
//        }
//        return resultsList;
//
//    }

    public List<WebResultItem> runQuery(String text, int limit) throws Exception{
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

}
