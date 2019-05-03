package services
import scala.concurrent.Future

trait QBEService {

  def databases() : Future[String]

  def helper(text : String) : Future[String]

  def query(text : String, withNER : Boolean) : Future[String]





}
