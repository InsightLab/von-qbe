import React, {Component} from 'react'

import './Results.css'

export class Results extends Component{

    render(){
        const header = this.props.header.map(h => <td>{h}</td>)
        const rows = this.props.children.map((child,i) => {
            let values = child.values;
            return (
                <tr className="nome" key={i}>
                    {this.props.header.map((h) => <td>{values[h]}</td>)}
                </tr>
            );
        });
        return (
            <div id="results">
                <table>
                    <thead>
                        <tr className="nome">
                            {header}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }

}