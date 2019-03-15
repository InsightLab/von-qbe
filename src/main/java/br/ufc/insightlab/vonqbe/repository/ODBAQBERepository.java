package br.ufc.insightlab.vonqbe.repository;


import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage;
import br.ufc.insightlab.vonqbe.service.impl.RORServiceImpl;
import org.apache.jena.query.QuerySolution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.QBEService;
import br.ufc.insightlab.vonqbe.service.RORService;

public class ODBAQBERepository extends QBERepository {

    QBEService qbeService;
    RORService rorService;

    Logger logger = LoggerFactory.getLogger(ODBAQBERepository.class);

    public ODBAQBERepository(String name, String mappingPath, String owlPath, String ntPath){
        super(ntPath);

        try {
         rorService = new RORServiceImpl(mappingPath, owlPath);
        } catch (Exception ex) {
         throw new ErrorFileMessage(ex.getCause().getMessage());
        }
       //rorService = new DummyRORServiceImpl();
        insertRepository(name, this);
    }

    public static QBERepository createODBAQBERepository(String name, String mappingPath, String owlPath, String ntPath) {
        return new ODBAQBERepository(name, mappingPath, owlPath, ntPath);
    }

    //public ResultQuerySet applyQuery(String sparql){
    public Iterator<QuerySolution> applyQuery(String sparql){
        try {
            //Iterator<QuerySolution> iterator = (Iterator<QuerySolution>) rorService.run(sparql).iterator();
            Iterator<QuerySolution> iterator = (Iterator<QuerySolution>) rorService.run(sparql);
            return iterator;
        } catch (Exception e) {
            logger.error(e.toString());
            //return new ResultQuerySet(null,null);
            return null;
        }
    }

    //public List<WebResultItem> mapResults(ResultQuerySet results){
    public List<WebResultItem> mapResults(Iterator<QuerySolution> results){
        List<WebResultItem> resultsList = new LinkedList<>();

        //while(results.iterator().hasNext()){
        while(results.hasNext()){
            ResultQuery r = (ResultQuery) results.next();
            resultsList.add(new WebResultItem(r));
        }

        return resultsList;
    }

    public List<WebResultItem> runQuery(String text, int limit){
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

}