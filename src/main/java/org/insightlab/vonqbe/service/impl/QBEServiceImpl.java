package org.insightlab.vonqbe.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.insightlab.graphast.structure.DefaultGraphStructure;
import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph;
import br.ufc.insightlab.linkedgraphast.modules.fragmentexpansor.FragmentExpansor;
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBEFragmentExtractor;
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBESparqlBuilder;
import br.ufc.insightlab.linkedgraphast.parser.NTripleParser;
import org.insightlab.vonqbe.service.QBEService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import scala.collection.Iterator;

/**
 * 
 * @author araujodavid
 * @since 08/02/2018
 */
//@Component
//@ApplicationScoped
public class QBEServiceImpl implements QBEService {

	private static Logger logger = LoggerFactory.getLogger(QBEServiceImpl.class);	
	private final String NT = "schema.nt";
//	private final String NT = "nobel_dump_schema.nt";
	private LinkedGraph schema;
	private VonQBEFragmentExtractor extractor;
	private VonQBESparqlBuilder sparqlBuilder;
	
	public QBEServiceImpl() {
		String path = System.getProperty("user.home");
		if(!path.endsWith("/"))
		    path += "/";

		String nt = path + this.NT;
        logger.info("[QBE API] Schema file: {}", nt);
        
        schema = new LinkedGraph(new DefaultGraphStructure());
		NTripleParser.parse(nt, schema);
	
		extractor = new VonQBEFragmentExtractor(schema); 
		sparqlBuilder = new VonQBESparqlBuilder(schema);
		
		logger.info("[QBE API] Graph load success!");
	}

	@Override
	public List<String> helper(String text) {
		LinkedGraph fragment = extractor.generateFragment(text);
		
		List<String> suggestions = new ArrayList<>();
		
		Iterator<String> it = FragmentExpansor.apply(schema, fragment).iterator(); 
		
		while(it.hasNext()) suggestions.add(it.next());
		logger.info("Suggestions: "+suggestions);
		return suggestions;
	}

	@Override
	public String query(String text) {
		return sparqlBuilder.generateSPARQL(text);
	}
}