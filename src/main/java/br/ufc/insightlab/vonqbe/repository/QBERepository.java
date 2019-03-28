package br.ufc.insightlab.vonqbe.repository;

import java.util.*;

import br.ufc.insightlab.ror.entities.ResultQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.QBEService;
import br.ufc.insightlab.vonqbe.service.impl.QBEServiceImpl;

public abstract class QBERepository {

    private static Logger logger = LoggerFactory.getLogger(QBERepository.class);

    private static Map<String, QBERepository> containers;

    private QBEService qbeService;

    public QBERepository(String ntPath) {
        this.qbeService = new QBEServiceImpl(ntPath);
    }

    public static Set<String> getDatabases(){

        if(containers == null)
            init();

        return containers.keySet();
    }

    public static void init(){
        containers = new HashMap<>();

    }

    // TODO esse repository nn deveria ser usado ?
    public void insertRepository(String name, QBERepository repository){
        if(containers == null)
            init();

        containers.put(name, this);
    }

    public static QBERepository getRepository(String name){
        return containers.get(name);
    }

    public static boolean containsControler(String name){
        return containers.containsKey(name);
    }

    public abstract List<WebResultItem> runQuery(String textDecoder, int limit) throws Exception;
    
    public String getSPARQL(String text, int limit){
        try{
            if (limit <= 0) {
                return qbeService.query(text);
            }else {
                return qbeService.query(text)+"LIMIT " + limit;
            }
        }
        catch(Exception e){
            return "";
        }
    }

    public abstract Iterable<ResultQuery> applyQuery(String sparql);

    public List<WebResultItem> mapResults(Iterable<ResultQuery> results){
        List<WebResultItem> resultsList = new LinkedList<>();

        int i = 0;

        for(ResultQuery result : results){
            ((LinkedList<WebResultItem>) resultsList).addLast(new WebResultItem(result));
        }

        return resultsList;

    }


    public List<String> helper(String text){
        return qbeService.helper(text);
    }
}