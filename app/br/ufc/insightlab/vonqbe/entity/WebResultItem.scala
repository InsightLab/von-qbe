package br.ufc.insightlab.vonqbe.entity

import br.ufc.insightlab.ror.entities.ResultQuery
import org.apache.jena.query.QuerySolution

class WebResultItem {

  // r is of generic type Q and may be only of the type ResultQuery or QuerySoluction
  def this(r : Any) {
    this()

    r match {
      case ResultQuery => r.asInstanceOf[ResultQuery]
        .getProjections
        .map((p : String) => p -> r.asInstanceOf[ResultQuery].getValue(p))
        .toMap
        .asScala

      case QuerySolution => r.asInstanceOf[QuerySolution]
        .varNames()
        .map((p : String) => p -> r.asInstanceOf[QuerySolution].getValue(p))
        .toMap
        .asScala

      case _ => ???
    }
  }

//    //if (r instanceof ResultQuery){
//    if (r match ResultQuery){
//
//      this (
//        r
//          .getProjections
//          .asScala
//          .map(p => p -> r.getValue(p))
//          .toMap
//      )
//
//    }else if(r instanceof QuerySolution) {
//
//      this (
//        r
//          .varNames()
//          .asScala
//          .map(p => p -> r.get(p))
//          .toMap
//      )
//
//    }
//    else
//      r = null
//  }

}