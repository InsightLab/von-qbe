package br.ufc.insightlab.vonqbe.repository

import java.util

import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph
import br.ufc.insightlab.linkedgraphast.modules.fragmentexpansor.FragmentExpansor
import br.ufc.insightlab.ror.entities.ResultQuery
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.{VonQBEFragmentExtractor, VonQBESparqlBuilder}
import br.ufc.insightlab.vonqbe.entity.WebResultItem

import scala.collection.mutable
import play.api.Logger

//import jdk.jfr.internal.Repository

import scala.concurrent.Future

abstract class QBERepository(var ntPath : String) {

  val logger : Logger = Logger(this.getClass())

  var container : mutable.HashMap[String, QBERepository]
  var sparqlBuilder : VonQBESparqlBuilder

  var schema : LinkedGraph
  var sparqlBuilder : VonQBESparqlBuilder
  var extractor : VonQBEFragmentExtractor


  /* ***************************************** BASICS ***************************************** */

  def init(): Unit = {
    container = new mutable.HashMap[String, QBERepository]()

  }

  def getDatabases(): collection.Set[String] = {
    if(container == null)
      init()

    container.keySet
  }

  def insertRepository(name : String, repository: QBERepository): Unit = {

    if(container == null)
      init()

    container += ("name" -> repository)
  }

  def getRepository(name : String): QBERepository = container.get(name).get

  def containsController(name : String): Boolean = container.contains(name)


  /* ***************************************** VONQBE ***************************************** */

//  // this function was in Service - I brought here
//  // esta função estava no Service - Eu trouxe p/ cá
  def query(text : String, withNER : Boolean) : String = {
    sparqlBuilder.generateSPARQL(text, withNER)
  }

  // assembling the query - montando a consulta
  def getSPARQL(text : String, limit : Int, withNER : Boolean): String = {

    if(limit <= 0)
      return query(text, withNER)
    else
      return query(text, withNER) + "LIMIT" + limit

  }

  // function definition - implementation only in derived classes (ex. Virtuoso)
  // definição da função - implementação somente em classes derivadas (ex. Virtuoso)
  def applyQuery(sparql : String): Iterable[ResultQuery]

  // converts the results from Iterable of ResultQuery to List of WebResultItem
  // converte os resultados de Iterable de ResultQuery para List de WebResultItem
  def mapResults(results : Iterable[ResultQuery]): List[WebResultItem] ={ //mutable.MutableList[WebResultItem] = {

    var list = results.map(resultQuery => new WebResultItem(resultQuery))
    list.toList

  }

  // function that generates the query, performs the query according to the type of bank and maps the results
  // função que gera a consulta, realiza a consulta de acordo com o tipo de banco e mapeia os resultados
  def runQuery(text : String, limit : Int, withNER : Boolean): List[WebResultItem] = {
    mapResults(applyQuery(getSPARQL(text, limit, withNER)))
  }

  // generate complements for the queries
  def helper(text : String) : scala.List[scala.Predef.String] = {

    var fragment : LinkedGraph = extractor.generateFragment(text)

    var suggestions : util.ArrayList[String] = new util.ArrayList[String]()

    // TODO entender pq nn ta recebendo o fragment
    var it: util.Iterator[String] =  FragmentExpansor.apply(schema, fragment).iterator

    while(it.hasNext) suggestions.+(it.next())

    logger.info("Suggestions: "+suggestions)

  }

}
