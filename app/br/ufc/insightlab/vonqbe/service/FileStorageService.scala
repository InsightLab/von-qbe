/*package br.ufc.insightlab.vonqbe.service

import java.nio.file.{Files, Path}
import java.io.IOException
import java.net.MalformedURLException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

import br.ufc.insightlab.vonqbe.exception.ErrorFileMessage
import br.ufc.insightlab.vonqbe.property.FileStorageProperties
import org.apache.http.HttpStatus
import play.api.libs.ws.WSClient
import play.shaded.ahc.org.asynchttpclient.util.StringUtils

import scala.io.Source

//import org.apache.commons.lang3.StringUtils

/*import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.util.StringUtils
import org.springframework.web.multipart.Source*/



class FileStorageService {

  var fileStorageLocation : Path
  var any : HttpStatus

  //@Autowired
  //def FileStorageService(fileStorageProperties : FileStorageProperties) : Unit = {
  def this(fileStorageProperties : FileStorageProperties) {
    this()


    fileStorageLocation = Paths.get(fileStorageProperties.uploadDir)
    //.toAbsolutePath().normalize()

    try {
      Files.createDirectories(this.fileStorageLocation);
    }
    catch {

      case ex: ErrorFileMessage => new ErrorFileMessage( any, "","" ){
        ex.getCause().getMessage()
      }

    }
  }

  def storeFile(file : Source) : String = {
    // Normalize file name
    // Normalize o caminho suprimindo sequências como "caminho / .." e pontos simples internos.

    //var fileName : String = StringUtils //.cleanPath(file.getOriginalFilename())
    //var fileName = StringUtils = file.toString()
    var fileName = StringUtils.cleanUtils


    try {
      // Check if the file's name contains invalid characters
      if(fileName.contains("..")) {
        throw new ErrorFileMessage("\"Sorry! Filename contains invalid path sequence \" + fileName")
      }

      // Copy file to the target location (Replacing existing file with the same name)
      var targetLocation : Path = this.fileStorageLocation.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      fileName
    } catch {
      case ex : IOException => throw new ErrorFileMessage(ex.getCause().getMessage());
    }
  }

  //TODO substituir UrlResource pq essa classe é do Spring
  def loadFileAsResource(fileName : String) : Source = {
    try {
      var filePath : Path = this.fileStorageLocation.resolve(fileName).normalize();
      //var resource : Source = new UrlResource(filePath.toUri());
      var resource : Source =
      if(resource.exists()) {
        resource
      } else {
        throw new ErrorFileMessage("");
      }
    } catch{
      case ex : MalformedURLException => new ErrorFileMessage(ex.getCause().getMessage())
    }
  }

}**/