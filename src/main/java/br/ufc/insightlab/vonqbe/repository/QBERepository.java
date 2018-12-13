package br.ufc.insightlab.vonqbe.repository;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.service.QBEService;
import br.ufc.insightlab.vonqbe.service.RORService;
import br.ufc.insightlab.vonqbe.service.impl.DummyRORServiceImpl;
import br.ufc.insightlab.vonqbe.service.impl.QBEServiceImpl;
import br.ufc.insightlab.vonqbe.service.impl.RORServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class QBERepository {

    private static Logger logger = LoggerFactory.getLogger(QBERepository.class);

    private static Map<String, QBERepository> containers;

    private QBEService qbeService;
    private RORService rorService;

    private QBERepository(String name, String mappingPath, String owlPath, String ntPath){
        qbeService = new QBEServiceImpl(ntPath);
//        rorService = new RORServiceImpl(mappingPath, owlPath);
        rorService = new DummyRORServiceImpl();

        if(containers == null)
            init();

        containers.put(name, this);
    }

    public static QBERepository createRepository(String name, String mappingPath, String owlPath, String ntPath){
        return new QBERepository(name, mappingPath, owlPath, ntPath);
    }

    public static Set<String> getDatabases(){

        if(containers == null)
            init();

        return containers.keySet();
    }

    public static void init(){
        containers = new HashMap<>();



    }

    public static QBERepository getRepository(String name){
        return containers.get(name);
    }

    public static boolean containsControler(String name){
        return containers.containsKey(name);
    }

    public List<String> helper(String text){
        return qbeService.helper(text);
    }

    public String getSPARQL(String text){
        try{
            return qbeService.query(text)+"LIMIT 30";
        }
        catch(Exception e){
            return "";
        }
    }

    public ResultQuerySet applyQuery(String sparql){
        try {
            return this.rorService.run(sparql);
        } catch (Exception e) {
            logger.error(e.toString());
            return new ResultQuerySet(null,null);
        }
    }

    public List<WebResultItem> mapResults(ResultQuerySet results){
        List<WebResultItem> resultsList = new LinkedList<>();

        for(ResultQuery r : results)
            resultsList.add(new WebResultItem(r));

        return resultsList;

    }

    public List<WebResultItem> runQuery(String text){
        return mapResults(applyQuery(getSPARQL(text)+"LIMIT 30"));
    }


}
