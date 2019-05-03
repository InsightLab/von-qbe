package repository

import com.softwaremill.macwire.wire
import play.api.BuiltInComponents
import repository.impl.{QBERepositoryImpl, VirtuosoRepositoryImpl}

trait RepositoryComponents extends BuiltInComponents {

    //REPOSITORY
    lazy val qbeRepo : QBERepository = wire[QBERepositoryImpl]
    lazy val virtuosoRepo : VirtuosoRepository = wire[VirtuosoRepositoryImpl]

}