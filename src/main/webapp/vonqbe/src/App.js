import React, { Component } from 'react';
import logo from './img/logo-insight.png';
import './App.css';
import {QBEContainer} from './QBE/QBEContainer'

class App extends Component {
  render() {
    return (
      <div id="layout">
        <div id="header">
          <div className="width">
              <div className="title">Virtual Ontology Query-by-Example <span>Von-QBE</span></div>
          <div id="logo"><img src={logo}/></div>
          </div>
      </div>
      
      
      <div id="status-bar">
        <div className="width">
          <div className="path" id="links">
              <button></button>
          </div>
        </div>
      </div>
      
      <div id="page">
        <QBEContainer />
      </div>
    </div>
    );
  }
}

export default App;
