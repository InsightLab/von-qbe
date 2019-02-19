import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'
import {Button} from 'antd';
import './Results.css'

export class Results extends Component{
  
  static propTypes = {
    results: PropTypes.array
  };

  reverseString(s){
    return s.split("").reverse().join("")
  }

  clearURI(uri){
    let reverseURI = this.reverseString(uri)
    let clean = ""
    let i = 1
    while(i < reverseURI.length && reverseURI[i] !== '/' && reverseURI[i] !== '#'){
      clean += reverseURI[i]
      i += 1
    }

    return this.reverseString(clean)

  }

  generateTableCell(value){
    if(value.startsWith("<http://"))
      return <a href={value.substring(1, value.length - 1)}>{this.clearURI(value)}</a>
    else return value
  }

  render(){
    //take the values keys from the first result, defining the table's header 
    let willRender = this.props.results.length > 0;

    
    const headerValues = willRender ? Object.keys(this.props.results[0].values) : []
    const headerElements = willRender ? headerValues.map((h,i) => <td key={i}>{h}</td>): []
    

    //map the elements from the results following the header's order
    const rows = this.props.results.map((element,i) => {
      let values = element.values;

      return (
        <tr className="nome" key={i}>
            {headerValues.map((h,i) => <td key={i}>{this.generateTableCell(values[h])}</td>)}
        </tr>
      );
    });


    let copyText = 
      headerValues.join("\t")+"\n" +
      this.props.results.map((element,i) => {
          let values = element.values;
          return headerValues.map((h,i) => values[h]).join("\t")
      }).join("\n");

    return (
      <div id="results">
        <CopyToClipboard text={copyText}><div><Button>Copy results</Button></div></CopyToClipboard>
          {willRender &&<table>
            <thead>
              <tr className="nome">
                {headerElements}
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>}
          {!willRender && <h3>No results found</h3>}
      </div>
    );
  }
}