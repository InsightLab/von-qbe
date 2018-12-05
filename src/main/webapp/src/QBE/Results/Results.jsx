import React, {Component} from 'react'

import './Results.css'

export class Results extends Component{

    render(){
        const headerValues = Object.keys(this.props.results[0].values)
        const headerElements = headerValues.map((h,i) => <td key={i}>{h}</td>)
        const rows = this.props.results.map((element,i) => {
            let values = element.values;

            return (
                <tr className="nome" key={i}>
                    {headerValues.map((h) => <td>{values[h]}</td>)}
                </tr>
            );
        });
        return (
            <div id="results">
                {this.props.results.length > 0 &&<table>
                    <thead>
                        <tr className="nome">
                            {headerElements}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>}
                {this.props.results.length === 0 && <h3>No results found</h3>}
            </div>
        );
    }

}