import React, { Component } from 'react';
import { Modal, Button, Input, Form, message } from 'antd';
import {UploadUi} from './Upload';
import {ServiceApiFile} from '../../Services/File';
import PropTypes from 'prop-types';

import './Modal.css';

const FormItem = Form.Item;

const success = () => {
  message.success();
  message.success('Success Operation');
};

export const UploadModal = 
Form.create()(
  class extends Component {

    static propTypes = {
      onOk: PropTypes.func,
      onSucess: PropTypes.func,
      onFail: PropTypes.func,
      onCancel: PropTypes.func,
      loading: PropTypes.bool,
      visible: PropTypes.bool,
      onAddBase: PropTypes.func
    };

    constructor(props){
        super(props);
    this.state = {
      name: '',
      databaseLink: '',
      file1: null,
      file2: null,
      isUsingVirtuoso: false,
      clearFiles: true,
      error: undefined
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    errorMessage = ( msg ) => {
      // message.error();
      // message.error(msg,10);
      this.setState({error: msg})
    };

    handleCheckboxChange(e){
        var isChecked = e.target.checked;
        if (!(isChecked  === this.state.isUsingVirtuoso)){
            this.setState({isUsingVirtuoso : isChecked});
        }
    };


    render() {
      const { onCancel, loading, visible} = this.props;
      const { getFieldDecorator } = this.props.form;
      const { file1, file2 } = this.state;

      return (
        <Modal
          title="New Database"
          visible={visible}
          onOk={this.handleButtonOk}
          onCancel={onCancel}
          footer={[
            <Button key="back" onClick={onCancel}>Cancel</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleButtonOk}>
              Save
            </Button>
          ]}>
           <div id="checkbox-virtuoso"><input type="checkbox" onChange={this.handleCheckboxChange}/> Virtuoso</div>
            <Form hidden={!this.state.isUsingVirtuoso}>
                <FormItem
                    label="Name"
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true,
                            message: 'Please input your name',
                        }],
                    })(
                        <Input
                            placeholder="Database Name" onChange={ (e) => this.handleChange(e, 'name')}
                        />
                    )}
                </FormItem>
                <FormItem
                    label="Database URI"
                >
                    {getFieldDecorator('database_uri', {
                        rules: [{
                            required: true,
                            message: 'Please input your database link',
                        }],
                    })(
                        <Input
                            placeholder="Database Link" onChange={ (e) => this.handleChangeDatabase(e, 'databaseLink')}
                        />
                    )}
                </FormItem>
            </Form>
            <Form hidden={this.state.isUsingVirtuoso}>
            <FormItem
              label="Name"
            >
              {getFieldDecorator('name', {
                   rules: [{
                    required: true,
                    message: 'Please input your name',
                  }],
                })(
                <Input
                  placeholder="Database Name" onChange={ (e) => this.handleChange(e, 'name')}
                  />
              )}
            </FormItem>
            <FormItem
              label="Mapping File (.odba)"
              >
              <div className="dropbox">
                {getFieldDecorator('file1', {
                   rules: [{
                    required: true,
                    message: 'Please input your File 1',
                  }],
                })(
                  <UploadUi 
                    visible
                    onChangeFile={(file) => this.handleSetFile(file, 'file1')} 
                    filelist={file1}
                    accept=".odba"
                    clear={this.state.clearFiles}
                    />
                )}
              </div>
            </FormItem>
            <FormItem
              label="RDF/XML Ontology Schema (.nt, .xml, .owl, .rdf)"
              >
              <div className="dropbox">
                {getFieldDecorator('file2', {
                   rules: [{
                    required: true,
                    message: 'Please input your File 2',
                  }],
                })(
                  <UploadUi 
                    visible
                    onChangeFile={(file) => this.handleSetFile(file, 'file2')} 
                    filelist={file2}
                    accept=".nt,.xml,.owl,.rdf"
                    clear={this.state.clearFiles}
                    />
                )}
              </div>
            </FormItem>
          </Form>
          {this.state.error && <div id="error">{this.state.error}</div>}
        </Modal>
      )
    }

    handleButtonOk = () =>{

      if(!this.state.isUsingVirtuoso) {
          const {onOk, onSucess, onAddBase, onFail} = this.props;
          const {setFields} = this.props.form;
          const {name, file1, file2} = this.state;

          if (!name) {
              setFields({
                  name: {
                      value: null,
                      errors: [new Error('Please input your name')],
                  },
              });
              return;
          }


          if (this.validateFile(file1, file2)) return;

          onOk();
          ServiceApiFile.addFile({name, file1, file2})
              .then(
                  (response) => {
                      const nameDatabase = response.data.name;
                      onAddBase(nameDatabase);
                      this.emptyState();
                      onSucess();
                      success();
                      this.setState({
                          clearFiles: true,
                          visible: false
                      });
                  })
              .catch((error) => {
                  //message.error();
                  if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      this.errorMessage("SERVER ERROR: " + error.response.data.message);
                  } else if (error.request) {
                      // The request was made but no response was received
                      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                      // http.ClientRequest in node.js
                      console.log(error);
                      this.errorMessage("Something went wrong at HTTP requisition. Check the console log for details")
                  } else {
                      // Something happened in setting up the request that triggered an Error
                      this.errorMessage("Something went wrong. Check the console log for details")
                      console.log('Error', error);
                  }
                  onFail();
              });
          //this.forceUpdate();
      }else{
          const {onOk, onSucess, onAddBase, onFail} = this.props;
          const {setFields} = this.props.form;
          const {name, databaseLink} = this.state;

          if (!name) {
              setFields({
                  name: {
                      value: null,
                      errors: [new Error('Please input your name')],
                  },
              });
              return;
          }

          if (!databaseLink) {
              setFields({
                  name: {
                      value: null,
                      errors: [new Error('Please input your name')],
                  },
              });
              return;
          }

          onOk();
          ServiceApiFile.addVirtuoso({name, databaseLink}).then(
              (response) => {
                  const nameDatabase = response.data.name;
                  onAddBase(nameDatabase);
                  this.emptyState();
                  onSucess();
                  success();
                  this.setState({
                      visible: false
                  });
              })
              .catch((error) => {
                  //message.error();
                  if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      this.errorMessage("SERVER ERROR: " + error.response.data.message);
                  } else if (error.request) {
                      // The request was made but no response was received
                      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                      // http.ClientRequest in node.js
                      console.log(error);
                      this.errorMessage("Something went wrong at HTTP requisition. Check the console log for details")
                  } else {
                      // Something happened in setting up the request that triggered an Error
                      this.errorMessage("Something went wrong. Check the console log for details")
                      console.log('Error', error);
                  }
                  onFail();
              });
      }

    }

    

    handleChange = (e, name)=>{
      var campoSendoAlterado = {"clearFiles": false};
      campoSendoAlterado[name] = e.target.value;
      this.setState(campoSendoAlterado);
    }

    handleChangeDatabase = (e, databaseLink)=>{
        var campoSendoAlterado = {"clearFiles": false};
        campoSendoAlterado[databaseLink] = e.target.value;
        this.setState(campoSendoAlterado);
    }

    handleSetFile = ( value, name ) =>{
      var campoSendoAlterado = {"clearFiles": false};
      campoSendoAlterado[name] = value;
      this.setState(campoSendoAlterado);
    }

    emptyState = () =>{
      const { setFields } = this.props.form;
      setFields({name: {value: null}, file1: {value: null}, file2: {value: null}});
      this.setState({
        name: '',
        file1: null,
        file2: null,
        error: undefined
      })
    }
    
    validateFile=( file1, file2)=>{
      const { setFields } = this.props.form;
      if ( !file1 ){  
        setFields({
          file1: {
            errors: [new Error('Please input file')],
          },
        });
        return true;
      }
      if ( !file2 ){  
        setFields({
          file2: {
            errors: [new Error('Please input file')],
          },
        });
        return true;
      }
      return false;
    }
  }



  

  
)//form