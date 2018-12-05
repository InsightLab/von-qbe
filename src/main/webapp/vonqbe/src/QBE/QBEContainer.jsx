import React, {Component} from 'react'
import axios from 'axios'
import {SearchField} from './SearchField/SearchField'
import {Results} from './Results/Results'
import './QBE.css'

export class QBEContainer extends Component{

    constructor(props){
        super(props)

        this.state = {
            "text": "",
            "suggestions": ['abc1','abc2','abc3']
        }

        this.handleSuggestionClick = this.handleSuggestionClick.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSuggestionClick(e) {
        let sugg = e.target.innerHTML
        let newText = this.state.text + " " + sugg

        this.handleTextChange(newText)
    }

    handleTextChange(text){
        console.log(text);
        
        this.setState({
            "text": text,
            "suggestions": undefined
        })
    }

    handleSubmit(text){
        this.setState({
            "text": text,
            "suggestions": undefined,
            "disabled": true,
            "isRequesting": true
        });

        axios.get('http://localhost:8080/query?text='+text).then(response => {
            console.log(response.data)
            
            this.setState({
                "text": text,
                "suggestions": [],
                "disabled": false,
                "isRequesting": false,
                "results": response.data
            }); 
        });
    }

    render() {
        return (
            <div id="page-hierarquia">
                <div className="page-title">
                    <label id="page-label"> </label>
                    <h1 id="page-title"> </h1>
                </div>
                <div className="tarja">
                    <div className="table">
                        <div id="hierarquia-navegacao" className="row header">
                            <SearchField 
                            onClick={this.handleSuggestionClick} 
                            text={this.state.text} 
                            suggestions={this.state.suggestions}
                            handleTextChange={this.handleTextChange}
                            onSubmit={this.handleSubmit}
                            disabled={this.state.disabled}
                            />
                        </div>
                    </div>
                </div>
                {this.state.results && 
                <Results header={Object.keys(this.state.results[0].values)}>
                    {this.state.results}
                </Results>
                }
            </div>
        );
    }

    componentDidUpdate(){
        if(this.state.text !== "" && !this.state.suggestions && !this.state.isRequesting){
            axios.get('http://localhost:8080/helper?text='+this.state.text).then(response => {
                this.setState({"suggestions": response.data});
            });
        }
    }

}