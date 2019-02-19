package br.ufc.insightlab.vonqbe.entity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.apache.jena.query.QuerySolution;

import br.ufc.insightlab.ror.entities.ResultQuery;

public class WebResultItem implements Serializable{
	
	public Map<String,String> values;
	
	public WebResultItem(ResultQuery r) {
		values = new HashMap<>();
		for(String k : r.getProjections()){
			values.put(k, r.getValue(k));
		}
	}

	public WebResultItem(QuerySolution r) {
		values = new HashMap<>();
		Iterator<String> varsIterator = r.varNames();
		while(varsIterator.hasNext()){
			String key = varsIterator.next();
			values.put(key, r.get(key).toString());
		}
	}
}
