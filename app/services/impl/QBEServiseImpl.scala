package services.impl

import java.util

import play.api.Logger
import repository.QBERepository

import scala.collection.mutable
import scala.concurrent.Future

class QBEServiseImpl (ntPath : String, qbeRepository : QBERepository) extends services.QBEService{

  var logger : Logger
  //var QBERepository : QBERepository
  //var squema : LinkedGraph

  logger.info("[QBE API] Schema file: "+ntPath)

  def helper(text : String) = List[String]{

    var suggestions : List[String] = new util.ArrayList[]()
    var it: util.Iterator[String] // = FragmentExpansor.apply(schema, fragment).iterator

    while(it.hasNext) suggestions.+(it.next())

    logger.info("Suggestions: "+suggestions)
  }

  def query(text : String, withNER : Boolean) : Future[String] //= sparqlBuilder

  def databases : Unit ={
    new mutable.LinkedList[String](qbeRepository.getDatabases())
  }
}
