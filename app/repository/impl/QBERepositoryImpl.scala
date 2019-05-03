package repository.impl

import scala.collection.mutable

class QBERepositoryImpl(qbeServiceImpl : QBEServiceImpl(ntPath : String)) extends repository.QBERepository{


  var qbeService : QBEService = new QBEServiceImpl(ntPath)
  var containers : Map[String, QBERepository]

  def databases() : Set[String] = {
    if(containers == null)
      init()

    containers.keySet
  }

  def init(): Unit ={
    containers = new mutable.HashMap[Nothing]()
  }

  def insertRepository(name : String, repository : QBERepository): Unit ={
    if(containers == null)
      init()

    containers += ("name" -> name)
    containers
  }

  def getRepository(name : String): QBERepository = containers.get(name)

  def containsController(name : String) : Boolean = containers.contains(name)

  def getSPARQL(text : String, limit : Int, withNER : Boolean) : String ={

    try {
      if(limit <= 0)
        return qbeService.query(text, withNER)
      else
        return qbeService.query(text, withNER) + "LIMIT " + limit
    }

    catch (e : Exception) = ""

  }

  def applyQuery(sparql : String): mutable.Iterable[]

  def mapResults(results : mutable.Iterable[]) : List[] = {
    var i : Int = 0


  }

  def runQuery(text : String, limit : Int, withNER : Boolean) : List[] = {
    mapResults(applyQuery(getSPARQL(text, limit, withNER)))
  }

  def helper(text : String) : List[String] = qbeService.helper(text)

}
