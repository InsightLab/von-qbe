package br.ufc.insightlab.vonqbe.repository;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage;
import br.ufc.insightlab.vonqbe.model.UploadFileResponse;
import br.ufc.insightlab.vonqbe.service.impl.RORServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.VirtuosoService;
import br.ufc.insightlab.vonqbe.service.RORService;
import br.ufc.insightlab.vonqbe.service.impl.DummyRORServiceImpl;
import br.ufc.insightlab.vonqbe.service.impl.QBEServiceImpl;
import org.apache.jena.query.*;

public class VirtuosoRepository extends QBERepository{

    Logger logger = LoggerFactory.getLogger(VirtuosoRepository.class);
    private String link;
    VirtuosoService virtuosoService;

    public VirtuosoRepository(String name, String linkURL, String baseURI, String ntPath){
        super(ntPath);
        this.link = link;
        virtuosoService = new VirtuosoService(link);
        insertRepository(name, this);
    }

    public static QBERepository createVirtuosoRepository(String name, String linkURL, String baseURI, String ntPath) {
        return new VirtuosoRepository(name, linkURL, baseURI, ntPath);
    }

    //    public List<String> helper(String text){
    //        return qbeService.helper(text);
    //    }


    //public Iterable<Object> applyQuery(String sparql) throws Exception{
    public QuerySolution applyQuery(String sparql) throws  Exception{
        //QuerySolution
        //return (Iterable<Object>) virtuosoService.run(sparql);
        return virtuosoService.run(sparql);
    }

    public List<WebResultItem> mapResults(Iterable<Object> results){
        List<WebResultItem> resultsList = new LinkedList<>();
        while(results.iterator().hasNext()) {
            QuerySolution rs = (QuerySolution) results.iterator().next();
            resultsList.add(new WebResultItem(rs));
        }
        return resultsList;

    }

    public List<WebResultItem> runQuery(String text, int limit) throws Exception{
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

//    public List<String> helper(String textDecoder) {
//        return null;
//    }
}
