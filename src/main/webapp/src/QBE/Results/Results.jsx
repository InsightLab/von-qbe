import React, {Component} from 'react'
import PropTypes from 'prop-types';

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

Results.propTypes = {
    results: PropTypes.array
}