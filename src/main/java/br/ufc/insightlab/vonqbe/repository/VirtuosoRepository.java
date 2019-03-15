package br.ufc.insightlab.vonqbe.repository;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.VirtuosoService;
import org.apache.jena.query.*;

public class VirtuosoRepository extends QBERepository{

    Logger logger = LoggerFactory.getLogger(VirtuosoRepository.class);
    private String link;
    VirtuosoService virtuosoService;

    // TODO onde q eu uso o baseURI na criação do banco Virtuoso
    public VirtuosoRepository(String name, String linkURL, String baseURI, String ntPath){
        super(ntPath);
        this.link = linkURL;
        virtuosoService = new VirtuosoService(linkURL);
        insertRepository(name, this);
    }

    public static QBERepository createVirtuosoRepository(String name, String linkURL, String baseURI, String ntPath) {
        return new VirtuosoRepository(name, linkURL, baseURI, ntPath);
    }

    //    public List<String> helper(String text){
    //        return qbeService.helper(text);
    //    }

    // TODO consertar essa função e todas as outras q tem Iterable<Object>
    // applyQuery nn é uma função Iterable<Object> e sim QuerySolution
    // apply query retorna virtuosoService.run(sparql) mas run do service é ResultSet
    // tem q mudar no service tmb

    //public Iterable<Object> applyQuery(String sparql) throws Exception{
    public Iterator<QuerySolution> applyQuery(String sparql) throws  Exception{
        //QuerySolution
        //return (Iterable<Object>) virtuosoService.run(sparql);
        return virtuosoService.run(sparql);
    }

    public List<WebResultItem> mapResults(Iterator<QuerySolution> results){
        List<WebResultItem> resultsList = new LinkedList<>();
        while(results.hasNext()) {
            QuerySolution rs = results.next();
            resultsList.add(new WebResultItem(rs));
        }
        return resultsList;

    }

    public List<WebResultItem> runQuery(String text, int limit) throws Exception{
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

}
