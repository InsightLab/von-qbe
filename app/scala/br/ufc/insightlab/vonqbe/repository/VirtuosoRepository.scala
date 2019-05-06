package scala.br.ufc.insightlab.vonqbe.repository

abstract class VirtuosoRepository(var name : String, var baseURI : String, var graphURI : String, var ntPath : String) with QBERepository{

  def applyQuery(sparql : String): Iterable[] = {}

}