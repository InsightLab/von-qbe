package br.ufc.insightlab.vonqbe

import br.ufc.insightlab.vonqbe.controllers.QBEController
import com.softwaremill.macwire._
import play.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import play.routing.Router
import play.{ApplicationLoader, BuiltInComponentsFromContext, routing}


/**
 * This class is a Guice module that tells Guice how to bind several
 * different types. This Guice module is created when the Play
 * application starts.

 * Play will automatically use any class called `Module` that is in
 * the root package. You can create modules in other locations by
 * adding `play.modules.enabled` settings to the `application.conf`
 * configuration file.
 */
class Module extends ApplicationLoader {

  def load(context : Context) = new ApplicationModule(context).application

}

class ApplicationModule(context: ApplicationLoader.Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents {

  override lazy val httpFilters = super.httpFilters()

  //val qbeService : QBEService
  /** lazy val qbeController : QBEController = wire[QBEController] */
  val qbeController : QBEController = wire[QBEController]

  override def router(): routing.Router = Router.empty()

}
