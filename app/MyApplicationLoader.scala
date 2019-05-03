import play.api._
import controllers.Assets
import play.api.ApplicationLoader.Context
import play.api.mvc.EssentialFilter
import play.api.routing.Router

class MyApplicationLoader extends ApplicationLoader {

  def load(context: Context): Application = {

    Logger.configure(context.environment)

    (new BuiltInComponentsFromContext(context) with AppComponents).application
  }

}


trait AppComponents extends BuiltInComponents with NingWSComponents
                                              with ControllerModule
{
  implicit val ec : ExecutionContext = scala.concurrent.ExecutionContext.Implicits.global

  lazy val assets: Assets = wire[Assets]
  lazy val router: Router = {
    lazy val prefix = "/"
    wire[Routes]
  }

  wire[Z]
}