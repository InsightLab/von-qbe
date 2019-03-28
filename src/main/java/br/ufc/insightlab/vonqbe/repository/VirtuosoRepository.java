package br.ufc.insightlab.vonqbe.repository;

import java.io.IOException;
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

    public VirtuosoRepository(String name, String linkURL, String baseURI, String ntPath) throws IOException {
        super(ntPath);
        this.link = linkURL;
        this.uri = baseURI;
        virtuosoService = new VirtuosoService(linkURL, baseURI);
        insertRepository(name, this);
    }

    public static QBERepository createVirtuosoRepository(String name, String linkURL, String baseURI, String ntPath) throws IOException {
        return new VirtuosoRepository(name, linkURL, baseURI, ntPath);
    }


    public Iterable<ResultQuery> applyQuery(String sparql){

        try {
            Iterable<ResultQuery> rs = virtuosoService.run(sparql);
            return rs;
        } catch (Exception e) {
            logger.error(e.toString());
            return new ResultQuerySet(null,null);
        }
    }

    public List<WebResultItem> runQuery(String text, int limit) throws Exception{
        return mapResults(applyQuery(getSPARQL(text, limit)));
    }

}
