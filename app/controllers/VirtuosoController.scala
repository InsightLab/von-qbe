package controllers

import model.UploadFileResponse
import play.api.mvc.{AbstractController, ControllerComponents}
import services.{QBEService, VirtuosoService}

class VirtuosoController(qbeService : QBEService, virtuosoService : VirtuosoService)(cc: ControllerComponents) extends AbstractController(cc){

  def uploadLink(name:String, baseURI: String, graphURI:String, squema : UploadFileResponse) = ReturnVirtuosoUpload {

    if(qbeService.validarLink(baseURI)){
      var retorno : model.ReturnVirtuosoUpload(name, baseURI, graphURI, squema)

      if()
    }

  }


}