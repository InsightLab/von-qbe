import React, { Component } from 'react';
import logo from './img/logo-insight.png';
import './App.css';
import { Dropdown, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import {UploadModal} from './QBE/Upload/Modal';
import { QBEContainer } from './QBE/QBEContainer'


class App extends Component {
  
  state = { 
    visible: false, 
    loading: false,
    selectDataBase: { key: '1', name: 'Database One'},
    optionsDatabases: 
    [ 
      { key: '1', name: 'Database One'}, 
      { key: '2', name: 'Database Two'},
     { key: '3', name: 'Database Tree'}
    ]
  };

  handleOpenModal = (e) =>{
    this.showModal();    
  }

  render() {
    const { selectDataBase, optionsDatabases} = this.state;
    const menu = (
      <Menu onClick={this.handleSelectDatabase}>
        <Menu.Item key='modal' onClick={this.handleOpenModal}>
          <Icon type="plus" />New Database
        </Menu.Item>
        {optionsDatabases.map(  ( database ) =>{
          return( 
            <Menu.Item key={database.key}>
              {database.name}
            </Menu.Item>);
        })}
      </Menu>
    );
    
    return (
      <div id="layout">
        <div id="header">
          <div className="width">
              <div className="title">Virtual Ontology Query-by-Example <span>Von-QBE</span></div>
          <div id="logo"><img alt={'logo'} src={logo}/></div>
          </div>
      </div>
      
      
      <div id="status-bar">
        <div className="width">
          <div>
            <div>
              <div style={{marginTop: 5}}>
                <Dropdown overlay={menu}>
                  {/* <a className="ant-dropdown-link" style={{color: '#fff'}} href="#"> */}
                    <div style={{cursor: 'pointer', color: '#fff'}}><b>Databases</b><Icon type="down" /></div>
                  {/* </a> */}
                </Dropdown>
                <label style={{ color: '#fff'}}>{selectDataBase.name}</label>
              </div>
            </div>
          </div>
          <div>
          {/* <div style={{ display: 'flex',  justifyContent: 'center' }}>  */}
            {/* <Button onClick={this.showModal}>
              New database
            </Button> */}
            <UploadModal 
              onOk={this.handleOk} 
              onCancel={this.handleCancel} 
              loading={this.state.loading} 
              visible={this.state.visible}/>
          </div>
        </div>

      </div>
      
      <div id="page">
        <QBEContainer />
      </div>
    </div>
    );
  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleSelectDatabase = (e) =>{
    const { optionsDatabases } = this.state; 
    if (e.key === 'modal') return;
    const database = optionsDatabases.find( ( value ) => ( e.key === value.key) );
    //console.log(database)
    this.setState({
      selectDataBase: database
    })

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleOk = (e) =>{
    console.log(e);
    this.setState({
      //visible: false,
      loading: true
    });

  }
}

export default App;
