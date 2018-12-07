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
        this.handleSocketMessage = this.handleSocketMessage.bind(this);

        this.socket = new WebSocket("ws://localhost:8080/query/websocket")
        this.socket.onmessage = this.handleSocketMessage;
    }

    sendMessage(socket,msg){
        if(socket.readyState === 1){
            socket.send(msg);
        }
        else{
            setTimeout(() => this.sendMessage(socket,msg), 1000);
        }
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

    handleSocketMessage(msg){
        let data = JSON.parse(msg.data);

        let id = parseInt(data.statusId);

        if(id < 3)
            this.setState({"queryStatus": id});
        else
            this.setState({
                "suggestions": [],
                "disabled": false,
                "isRequesting": false,
                "queryStatus": id,
                "results": data.results
            }); 
    }

    handleSubmit(text){
        this.setState({
            "text": text,
            "suggestions": undefined,
            "disabled": true,
            "isRequesting": true,
            "queryStatus": 0,
            "results": undefined
        });

        // axios.get('http://localhost:8080/query?text='+text).then(response => {            
        //     this.setState({
        //         "text": text,
        //         "suggestions": [],
        //         "disabled": false,
        //         "isRequesting": false,
        //         "results": response.data
        //     }); 
        // });
        
        let msg = {"database":"imdb", "text": text}
        this.sendMessage(this.socket,JSON.stringify(msg))


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
            queryStatus={this.state.queryStatus}
            />
        );
    }

    componentDidUpdate(){
        if(this.state.text !== "" && !this.state.suggestions && !this.state.isRequesting){
            axios.get('http://localhost:8080/helper?text='+this.state.text+"&database="+"imdb").then(response => {
                this.setState({"suggestions": response.data});
            });
        }
    }

}