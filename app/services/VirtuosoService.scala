package services
import scala.concurrent.Future

trait VirtuosoService {

  def run(sparql : String) : Future[Iterable[ResultQuery]]

}