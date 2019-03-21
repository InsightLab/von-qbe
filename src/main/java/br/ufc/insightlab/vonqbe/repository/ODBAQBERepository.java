package br.ufc.insightlab.vonqbe.repository;


import java.util.List;

import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage;
import br.ufc.insightlab.vonqbe.service.impl.RORServiceImpl;
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

    public Iterable<ResultQuery> applyQuery(String sparql){
        try {
            Iterable<ResultQuery> iterator = (Iterable<ResultQuery>) rorService.run(sparql);
            ResultQuerySet rs = (ResultQuerySet) iterator.iterator();
            //ResultQuery rq = rs.iterator().next();

//            while (iterator.iterator().hasNext()){
//
//                for (String projection : iterator.iterator().next().getProjections()){
//                    rq.addValue(projection, iterator.iterator().next().getValue(projection));
//                }
//            }

            return rs;
        } catch (Exception e) {
            logger.error(e.toString());
            return new ResultQuerySet(null,null);
            //return new ResultQuery(0);
        }
    }


    public List<WebResultItem> runQuery(String text, int limit){
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

}