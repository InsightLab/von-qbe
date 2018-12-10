import React, {Component} from 'react'
//import axios from 'axios'
import {SearchField} from './SearchField/SearchField'
import {Results} from './Results/Results'
import PropTypes from 'prop-types'
import './QBE.css'

export class QBE extends Component{

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
                            onClick={this.props.handleSuggestionClick} 
                            text={this.props.text} 
                            suggestions={this.props.suggestions}
                            handleTextChange={this.props.handleTextChange}
                            onSubmit={this.props.handleSubmit}
                            disabled={this.props.disabled}
                            />
                        </div>
                    </div>
                </div>
                {this.props.results && 
                <Results results={this.props.results}>
                    {this.props.results}
                </Results>
                }
            </div>
        );
    }
}

QBE.propTypes = {
    handleSuggestionClick: PropTypes.func,
    handleTextChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    text: PropTypes.string,
    suggestions: PropTypes.array,
    disabled: PropTypes.bool,
    results: PropTypes.array
}