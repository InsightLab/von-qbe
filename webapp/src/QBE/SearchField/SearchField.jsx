import React, {Component} from 'react';
import {Suggestions} from './Suggestions/Suggestions';
import {Input} from 'antd';
import PropTypes from 'prop-types';

import './SearchField.css';

const WAIT_INTERVAL = 1000;

export class SearchField extends Component{
    
  constructor(props){
    super(props);

    this.state = {
      inputValue: props.text,
      number: props.limit,
      isUsingNER: false
    };

    this.handleChangValue = this.handleChangValue.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  static propTypes = {
    onSubmit: PropTypes.func,
    handleTextChange: PropTypes.func,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    suggestions: PropTypes.array,
    onChangeLimit: PropTypes.func,
  };

  componentWillReceiveProps(nextProps){
    this.timer = null;
    this.setState({inputValue: nextProps.text});
  }
  
  handleChangValue(e){
    let text = e.target.value;
    this.setState({inputValue: text});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.triggerChange({text})}, WAIT_INTERVAL);
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit(this.state.inputValue, this.state.isUsingNER ,false)
  }

  triggerChange({text, isViewSugestion}){
    this.props.handleTextChange(text);
    this.props.onChangeLimit(this.state.number, isViewSugestion);
  }

  handleCheckboxChange(e){
      var isChecked = e.target.checked;
      if (!(isChecked  === this.state.isUsingNER)){
        this.setState({isUsingNER : isChecked});
      } 
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

        <label id="label-ner">
          NER :
          <input
            id="checkbox-ner"
            type="checkbox"
            onChange={this.handleCheckboxChange} />
        </label>

        <input id="run" type="submit" value="" title="Click to execute the search."/>
        
        <Input
          type="text"
          title="Limit"
          placeholder="Limit" 
          value={this.state.number}
          onChange={this.handleNumberChange}
          style={{ width: '5%', height: 40, marginLeft: 10 }}
          />

        {(this.props.suggestions && this.props.suggestions.length > 0) && 
          <Suggestions>
              {this.props.suggestions.map((item,i) => <div key={i} onClick={this.props.onClick}>{item}</div>)}
          </Suggestions>
        }

      
      
      </form>
    );
  }

  handleNumberChange = (e) => {
    const number = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(number)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    clearTimeout(this.timer);
    const mostrar = false;
    this.timer = setTimeout(() => { this.triggerChange({text: this.state.inputValue, isViewSugestion: mostrar})}, WAIT_INTERVAL);
  }

}
