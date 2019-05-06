package scala.br.ufc.insightlab.vonqbe.services
import scala.concurrent.Future

trait VirtuosoService {

  def run(sparql : String) : Future[Iterable[ResultQuery]]

}