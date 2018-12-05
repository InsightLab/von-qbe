import React, {Component} from 'react'
import {Suggestions} from './Suggestions/Suggestions'

const WAIT_INTERVAL = 1000;

export class SearchField extends Component{
    
    constructor(props){
        super(props);

        this.state = {"inputValue": props.text};

        this.handleChangValue = this.handleChangValue.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.timer = null;

        this.setState({"inputValue": nextProps.text});
    }
    
    handleChangValue(e){
        let text = e.target.value;
        this.setState({"inputValue": text});

        clearTimeout(this.timer);
        this.timer = setTimeout(() => { this.triggerChange(text)}, WAIT_INTERVAL);
    }

    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();

        this.props.onSubmit(this.state.inputValue)
    }

    triggerChange(text){
        this.props.handleTextChange(text);
    }

    render(){
        return (
            <form id="search-field" onSubmit={this.handleSubmit}>
                <input 
                    id="input-search"
                    value={this.state.inputValue}
                    placeholder="Search"
                    autoComplete="off"
                    onChange={this.handleChangValue}
                    disabled={(this.props.disabled) ? "disabled" : ""}
                    />
                <input id="run" type="submit" value="" title="Click to execute the search."/>
                {(this.props.suggestions && this.props.suggestions.length > 0) && 
                    <Suggestions>
                        {this.props.suggestions.map((item,i) => <div key={i} onClick={this.props.onClick}>{item}</div>)}
                    </Suggestions>
                }
            </form>
        );
    }
}