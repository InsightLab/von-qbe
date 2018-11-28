package org.insightlab.vonqbe.entity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import br.ufc.insightlab.ror.entities.ResultQuery;

public class WebResultItem implements Serializable{
	
	public Map<String,String> values;
	
	public WebResultItem(ResultQuery r) {
		values = new HashMap<>();
		for(String k : r.getProjections()){
			values.put(k, r.getValue(k));
		}
	}
}
