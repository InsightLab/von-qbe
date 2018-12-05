import React, {Component} from 'react'

export class Suggestions extends Component{
    render(){
        return (
            <div id="search-results" style={{opacity: 1}}>
                {this.props.children}
            </div>
        );
    }
}