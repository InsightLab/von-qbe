package br.ufc.insightlab.vonqbe.socket.handler;

import br.ufc.insightlab.ror.entities.ResultQuery;
import br.ufc.insightlab.ror.entities.ResultQuerySet;
import br.ufc.insightlab.vonqbe.repository.QBERepository;
import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import br.ufc.insightlab.vonqbe.socket.messages.QueryMessageFactory;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class QueryWebSocketHandler extends TextWebSocketHandler{

    private static Logger logger = LoggerFactory.getLogger(QueryWebSocketHandler.class);

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException {
        JSONObject msg = new JSONObject(message.getPayload());
        String database = msg.get("database").toString();
        String text = msg.get("text").toString();
        int limit = Integer.parseInt(msg.get("limit").toString());
        boolean withNER = Boolean.parseBoolean(msg.get("isUsingNER").toString());
        logger.info("database: {}, text: {}",database, text);
        QBERepository controler = QBERepository.getRepository(database);

        if(controler == null){
            logger.error("Database {} not found!", database);
            JSONObject err = new JSONObject();
            err.put("error",("Database not found: " + database));
            session.sendMessage(new TextMessage(err.toString()));

            return ;
        }

        long start = 0,
                end = 0;

        start = System.currentTimeMillis();
        String sparql = controler.getSPARQL(text, limit, withNER);
        end = System.currentTimeMillis();

        session.sendMessage(QueryMessageFactory.generateSPARQLMessage(sparql, end-start));

        start = System.currentTimeMillis();
        ResultQuerySet resultSet = controler.applyQuery(sparql);
        end = System.currentTimeMillis();

        session.sendMessage(QueryMessageFactory.generateRunMessage(end-start));

        start = System.currentTimeMillis();
        List<WebResultItem> results = controler.mapResults(resultSet);
        end = System.currentTimeMillis();

        session.sendMessage(QueryMessageFactory.generateResultsMessage(results, end-start));

    }

    private class FileResultQuerySet extends ResultQuerySet {

        FileResultQuerySet(){
            super(null,null);
        }

        private List<ResultQuery> getfromFile() {
            List<ResultQuery> list = new ArrayList<>();

            try {
                List<String> lines = Files.readAllLines(Paths.get("src/main/resources/dummyQueryResults.tsv"));
                String[] header = lines.remove(0).split("\t");

                for(String line : lines) {
                    ResultQuery result = new ResultQuery(0);
                    int i = 0;
                    for(String field : line.split("\t")) {
                        if(field.startsWith("http"))
                            field = "<"+field+">";
                        if(field.equals(""))
                            field = " ";
                        result.addValue(header[i], field);
                        i += 1;
                    }

                    list.add(result);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }


            return list;
        }

        @Override
        public Iterator<ResultQuery> iterator() {
            return getfromFile().iterator();
        }
    }


    public ResultQuerySet run(String sparql) {

        return new FileResultQuerySet();
    }
}
