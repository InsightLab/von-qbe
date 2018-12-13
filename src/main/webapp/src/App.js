import React, { Component } from 'react';
import logo from './img/logo-insight.png';
import './App.css';
import { Dropdown, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import {UploadModal} from './QBE/Upload/Modal';
import { QBEContainer } from './QBE/QBEContainer'
import { ServiceApiQBE } from './Services/QBE';


class App extends Component {
  
  state = { 
    visible: false, 
    loading: false,
    selectDataBase: '',
    optionsDatabases: [],
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
        {optionsDatabases.map(  ( database, key ) =>{
          return( 
            <Menu.Item key={key}>
              {database}
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
                <label style={{ color: '#fff'}}>{selectDataBase}</label>
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
              onSucess={this.handleSucess}
              loading={this.state.loading} 
              visible={this.state.visible}
              onAddBase={this.handleAddDatabase}/>
          </div>
        </div>

      </div>
      
      <div id="page">
        {selectDataBase && <QBEContainer database={selectDataBase}/>}
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
    if (e.key === 'modal') return;
    const { optionsDatabases } = this.state;
    const database = optionsDatabases[e.key];
    //console.log(database)
    this.setState({
      selectDataBase: database
    })

  }

  handleCancel = (e) => {
    //console.log(e);
    this.setState({
      visible: false,   
    });
  }

  handleOk = (e) =>{
    this.setState({
      loading: true
    });
  }

  handleSucess = () =>{
    this.setState({
      loading: false,
      visible: false,
    });
  }

  componentWillMount(){
    ServiceApiQBE.listDatabases().then(
      (response) =>{
        const database = response.data;
        this.setState({optionsDatabases: database});
      }
    );
  }

  handleAddDatabase=( database )=>{
    const {optionsDatabases} = this.state;
    this.setState({
      optionsDatabases: [...optionsDatabases, database],
      selectDataBase: database
    })
  }
}

export default App;
