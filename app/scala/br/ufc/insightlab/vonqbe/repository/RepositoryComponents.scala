package scala.br.ufc.insightlab.vonqbe.repository

import com.softwaremill.macwire.wire
import play.api.BuiltInComponents
import scala.br.ufc.insightlab.vonqbe.repository.impl.{QBERepositoryImpl, VirtuosoRepositoryImpl}

trait RepositoryComponents extends BuiltInComponents {

    //REPOSITORY
    lazy val qbeRepo : QBERepository = wire[QBERepositoryImpl]
    lazy val virtuosoRepo : VirtuosoRepository = wire[VirtuosoRepositoryImpl]

}