package br.ufc.insightlab.vonqbe.socket.messages;

import br.ufc.insightlab.vonqbe.entity.WebResultItem;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;

import java.util.List;

public class QueryMessageFactory {

    public static TextMessage generateSPARQLMessage(String sparql, long time){
        JSONObject obj = new JSONObject();
        obj.put("sparql", sparql);
        obj.put("time", time);
        obj.put("statusId",1);
        return new TextMessage(obj.toString());
    }

    public static TextMessage generateRunMessage(long time){
        JSONObject obj = new JSONObject();
        obj.put("time", time);
        obj.put("statusId",2);
        return new TextMessage(obj.toString());
    }

    public static TextMessage generateResultsMessage(List<WebResultItem> items, long time){
        JSONObject obj = new JSONObject();
        obj.put("time", time);
        obj.put("statusId",3);
        JSONArray arr = new JSONArray();

        for(WebResultItem wi : items){
            JSONObject itemObj = new JSONObject();
            JSONObject values = new JSONObject();

            for(String value : wi.values.keySet())
                values.put(value,wi.values.get(value));

            itemObj.put("values", values);
            arr.put(itemObj);
        }

        obj.put("results", arr);
        return new TextMessage(obj.toString());
    }

}
