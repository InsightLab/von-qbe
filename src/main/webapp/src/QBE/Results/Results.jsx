import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'
import {Button} from 'antd';
import './Results.css'

export class Results extends Component{
    render(){
        //take the values keys from the first result, defining the table's header 
        const headerValues = Object.keys(this.props.results[0].values)
        const headerElements = headerValues.map((h,i) => <td key={i}>{h}</td>)

        //map the elements from the results following the header's order
        const rows = this.props.results.map((element,i) => {
            let values = element.values;

            return (
                <tr className="nome" key={i}>
                    {headerValues.map((h,i) => <td key={i}>{values[h]}</td>)}
                </tr>
            );
        });

        let willRender = this.props.results.length > 0;

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

Results.propTypes = {
    results: PropTypes.array
}