package scala.br.ufc.insightlab.vonqbe.controllers

import scala.br.ufc.insightlab.vonqbe.model.UploadFileResponse
import play.api.mvc.{AbstractController, ControllerComponents}
import scala.br.ufc.insightlab.vonqbe.services.{QBEService, VirtuosoService}

class VirtuosoController(qbeService : QBEService, virtuosoService : VirtuosoService)(cc: ControllerComponents) extends AbstractController(cc){

  def uploadLink(name:String, baseURI: String, graphURI:String, squema : UploadFileResponse) = ReturnVirtuosoUpload {

    if(qbeService.validarLink(baseURI)){
      var retorno : scala.br.ufc.insightlab.vonqbe.model.ReturnVirtuosoUpload(name, baseURI, graphURI, squema)

      if()
    }

  }


}