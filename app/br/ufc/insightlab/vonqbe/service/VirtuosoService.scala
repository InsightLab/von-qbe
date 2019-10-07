package br.ufc.insightlab.vonqbe.service

import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBESparqlBuilder
import br.ufc.insightlab.ror.entities.ResultQuery
import br.ufc.insightlab.vonqbe.repository.VirtuosoRepository


class VirtuosoService(virtuosoRepository : VirtuosoRepository) extends QBEService(virtuosoRepository){

  override var schema: LinkedGraph = _
  override var sparqlBuilder: VonQBESparqlBuilder = _

  def createVirtuosoRepository(name : String, baseURI : String, graphURI : String, ntPath : String) = {
    virtuosoRepository.createVirtuosoRepository(name, baseURI, graphURI, ntPath)
  }

  def run (sparql : String) : Iterable[ResultQuery] = {
    virtuosoRepository.run(sparql)
  }

  override def applyQuery(sparql : String) : Iterable[ResultQuery] = {
    virtuosoRepository.applyQuery(sparql)
  }

  override def query(text : String, withNER : Boolean) : String = {
    virtuosoRepository.query(text, withNER)
  }

}