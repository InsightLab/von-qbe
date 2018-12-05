import React, {Component} from 'react'
import axios from 'axios'
import {QBE} from './QBE'

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
            <QBE 
            handleSuggestionClick={this.handleSuggestionClick}
            handleTextChange={this.handleTextChange}
            handleSubmit={this.handleSubmit}
            text={this.state.text}
            suggestions={this.state.suggestions}
            disabled={this.state.disabled}
            results={this.state.results}
            />
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