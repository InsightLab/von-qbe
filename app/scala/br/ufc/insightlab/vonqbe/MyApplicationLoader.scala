package scala.br.ufc.insightlab.vonqbe

import play.api.ApplicationLoader.Context
import play.api._
import play.api.routing.Router

import controllers.Assets
import scala.concurrent.ExecutionContext

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