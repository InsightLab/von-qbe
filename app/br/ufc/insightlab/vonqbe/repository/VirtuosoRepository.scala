package br.ufc.insightlab.vonqbe.repository

import java.util

import br.ufc.insightlab.linkedgraphast.model.graph.LinkedGraph
import br.ufc.insightlab.linkedgraphast.modules.vonqbe.{VonQBEFragmentExtractor, VonQBESparqlBuilder}
import br.ufc.insightlab.ror.entities.ResultQuery
import org.apache.jena.query.{QueryExecution, QueryExecutionFactory, QueryFactory, QuerySolution, _}
import play.api.Logger

import scala.collection.mutable

class VirtuosoRepository(var name: String, var baseURI : String, var graphURI : String, override var ntPath : String) extends QBERepository(ntPath){

  super.ntPath = ntPath
  super.insertRepository(name, this)

  //override var container : mutable.HashMap[String, VirtuosoRepository]
  // TODO entender pq nn posso usar o VirtuosoRepository aqui se o virtuoso extende de QBE
  var container = new mutable.HashMap[String, VirtuosoRepository]()
  var sparqlBuilder : VonQBESparqlBuilder

  override val logger : Logger = Logger(this.getClass())

  var container : mutable.HashMap[String, QBERepository]
  var sparqlBuilder : VonQBESparqlBuilder
  var schema : LinkedGraph
  var sparqlBuilder : VonQBESparqlBuilder
  var extractor : VonQBEFragmentExtractor

  def createVirtuosoRepository(name : String, baseURI : String, graphURI : String, ntPath : String) = {
    //new VirtuosoRepository(name, baseURI, graphURI, ntPath)
    this(name, baseURI, graphURI, ntPath)
  }

  def run (sparql : String) : Iterable[ResultQuery] = {

    var query : Query = QueryFactory.create(sparql)
    var exec  : QueryExecution = QueryExecutionFactory.sparqlService(sparql,query)
    var results : ResultSet = exec.execSelect()

    //var rs : List[ResultQuery] = new mutable.LinkedList[ResultQuery]()
    // it is indicated to use MutableList instead of LinkedList because LinkedList has been deprecated
    var rs : mutable.MutableList[ResultQuery] = new mutable.MutableList[ResultQuery]

    while (results.hasNext){

      var sol : QuerySolution = results.next()

      var result : ResultQuery = new ResultQuery()

      var vars : util.Iterator[String] = sol.varNames()

      while (vars.hasNext){

        var vari : String = vars.next()
        result.addValue(vari,sol.get(vari).toString)
      }

      rs.+:(result)
    }

    rs
  }

  def applyQuery(sparql : String) : Iterable[ResultQuery] = {

    var rs : Iterable[ResultQuery] = run(sparql)

    rs

  }

  override def query(text: String, withNER: Boolean): String = {
    sparqlBuilder.generateSPARQL(text, withNER) //.toString
  }
}
