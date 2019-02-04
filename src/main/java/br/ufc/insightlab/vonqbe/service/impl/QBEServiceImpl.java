package br.ufc.insightlab.vonqbe.service.impl;

import java.util.ArrayList;
import java.util.List;

import br.ufc.insightlab.graphast.structure.DefaultGraphStructure;
import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph;
import br.ufc.insightlab.linkedgraphast.modules.figer.Figer;
import br.ufc.insightlab.linkedgraphast.modules.fragmentexpansor.FragmentExpansor;
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBEFragmentExtractor;
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBESparqlBuilder;
import br.ufc.insightlab.linkedgraphast.parser.NTripleParser;
import br.ufc.insightlab.vonqbe.service.QBEService;

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
//	private final String NT = "nobel_dump_schema.nt";
	private LinkedGraph schema;
	private VonQBEFragmentExtractor extractor;
	private VonQBESparqlBuilder sparqlBuilder;
	
	public QBEServiceImpl(String nt) {
        logger.info("[QBE API] Schema file: {}", nt);
        
        schema = new LinkedGraph(new DefaultGraphStructure());
		NTripleParser.parse(nt, schema);
	
		extractor = new VonQBEFragmentExtractor(schema); 
		sparqlBuilder = new VonQBESparqlBuilder(schema, false);
		
		logger.info("[QBE API] Graph load success!");
	}

	@Override
	public List<String> helper(String text) {
		
		LinkedGraph fragment = extractor.generateFragment(text);
		
		List<String> suggestions = new ArrayList<>();

		try {
			Iterator<String> it = FragmentExpansor.apply(schema, fragment).iterator();
			while(it.hasNext()) suggestions.add(it.next());
			logger.info("Suggestions: "+suggestions);
		}
		catch(Exception e){
			logger.info("No suggestions found");
		}
		
		return suggestions;
	}

	@Override
	public String query(String text) {
		return sparqlBuilder.generateSPARQL(text, true);
	}
}