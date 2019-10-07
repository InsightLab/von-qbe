package br.ufc.insightlab.vonqbe.service

import br.ufc.insightlab.graphast.structure.DefaultGraphStructure
import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.VonQBESparqlBuilder
import br.ufc.insightlab.ror.entities.ResultQuery
import br.ufc.insightlab.vonqbe.entity.WebResultItem
import br.ufc.insightlab.vonqbe.repository.QBERepository

abstract class QBEService(qbeRepository: QBERepository) {

  var schema : LinkedGraph
  var sparqlBuilder : VonQBESparqlBuilder

  def this(nt : String){
    this(qbeRepository)

    schema = new LinkedGraph(new DefaultGraphStructure)
  }

  def init(): Unit = {
    qbeRepository.init()
  }

  def getDatabases(): collection.Set[String] = {
    qbeRepository.getDatabases()
  }

  def insertRepository(name : String, repository: QBERepository): Unit = {
    qbeRepository.insertRepository(name, repository)
  }

  def getRepository(name : String): Unit = {
    qbeRepository.getRepository(name)
  }

  def containsController(name : String): Boolean = {
    qbeRepository.containsController(name)
  }

  def query(text : String, withNER: Boolean) : String = {
    qbeRepository.query(text, withNER)
  }

  def getSPARQL(text : String, limit : Int, withNER : Boolean): String = {
    qbeRepository.getSPARQL(text, limit, withNER)
  }

  def applyQuery(sparql : String): Iterable[ResultQuery] = {
    qbeRepository.applyQuery(sparql)
  }

  def mapResults(result : Iterable[ResultQuery]): List[WebResultItem] = {
    qbeRepository.mapResults(result)
  }

  def runQuery(text : String, limit : Int, withNER : Boolean): List[WebResultItem] = {
    qbeRepository.runQuery(text, limit, withNER)
  }

  def helper(text : String) : scala.List[scala.Predef.String] = {
    qbeRepository.helper(text)
  }

//  def query(text : String, withNER : Boolean) : String = {
//      sparqlBuilder.generateSPARQL(text, withNER)
//  }


}