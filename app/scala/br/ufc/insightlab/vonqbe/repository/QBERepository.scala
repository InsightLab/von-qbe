package scala.br.ufc.insightlab.vonqbe.repository

import scala.br.ufc.insightlab.vonqbe.services.QBEService

import scala.collection.mutable
import scala.concurrent.Future

abstract class QBERepository(ntPath : String) {

  var qbeService : QBEService = new QBEServiceImpl(ntPath)
  var containers : Map[String, QBERepository]

  def getDatabases() : Set[String]

  def init(): Unit

  def insertRepository(name : String, repository : QBERepository): Unit

  def getRepository(name : String): QBERepository //= containers.get(name)

  def containsController(name : String) : Boolean //= containers.contains(name)

  def getSPARQL(text : String, limit : Int, withNER : Boolean) : String //={

  def applyQuery(sparql : String): mutable.Iterable[]

  def mapResults(results : mutable.Iterable[]) : List[]

  def runQuery(text : String, limit : Int, withNER : Boolean) : List[] //= {

  //def helper(text : String) : List[String] = qbeService.helper(text)
  def helper(text : String) : Future[List[String]]

}
