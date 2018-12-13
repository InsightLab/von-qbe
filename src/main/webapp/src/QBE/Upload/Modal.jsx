import React, { Component } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import {UploadUi} from './Upload';
import {ServiceApiFile} from '../../Services/File';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

export const UploadModal = 
Form.create()(
  class extends Component {

    static propTypes = {
      onOk: PropTypes.func,
      onSucess: PropTypes.func,
      onCancel: PropTypes.func,
      loading: PropTypes.bool,
      visible: PropTypes.bool,
      onAddBase: PropTypes.func
    };

    state = {
      name: '',
      file1: null,
      file2: null,
      file3: null,
    }

    render() {

      const { onCancel, loading, visible} = this.props;
      const { getFieldDecorator } = this.props.form;
      const { file1, file2, file3 } = this.state;

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
          <Form>
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
                    filelist={file1}/>
                )}
              </div>
            </FormItem>
            <FormItem
              label="RDF/XML Ontology Schema (.xml, .owl, .rdf)"
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
                    />
                )}
              </div>
            </FormItem>
            <FormItem
              label="N-Triple Ontology Schema (.nt)"
              >
              <div className="dropbox">
                {getFieldDecorator('file3', {
                   rules: [{
                    required: true,
                    message: 'Please input File 3',
                  }],
                })(
                  <UploadUi 
                    visible
                    onChangeFile={(file) => this.handleSetFile(file, 'file3')}
                    filelist={file3}/>
                )}
              </div>
            </FormItem>
          </Form>
        </Modal>
      )
    }

    handleButtonOk = () =>{
      const {onOk, onSucess, onAddBase} = this.props;
      const { setFields } = this.props.form;
      const{ name, file1, file2, file3} = this.state;

      if ( !name ){
        setFields({
          name: {
            value: null,
            errors: [new Error('Please input your name')],
          },
        });
        return;
      };

      if (this.validateFile(file1 , file2, file3))return;
     
      onOk();
      ServiceApiFile.addFile( {name, file1, file2, file3}).then(
        ( response ) =>{
          const nameDatabase = response.data.name;
          onAddBase(nameDatabase);
          this.emptyState();
          onSucess();
        }
      );
      //this.forceUpdate();
    }

    handleChange = (e, name)=>{
      var campoSendoAlterado = {};
      campoSendoAlterado[name] = e.target.value;
      this.setState(campoSendoAlterado);
    }

    handleSetFile = ( value, name ) =>{
      var campoSendoAlterado = {};
      campoSendoAlterado[name] = value;
      this.setState(campoSendoAlterado);
    }

    emptyState = () =>{
      const { setFields } = this.props.form;
      setFields({name: {value: null}, file1: {value: null}, file2: {value: null}, file3: {value:null}});
      this.setState({
        name: '',
        file1: null,
        file2: null,
        file3: null,
      })
    }
    
    validateFile=( file1, file2, file3)=>{
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
      if ( !file3 ){  
        setFields({
          file3: {
            errors: [new Error('Please input file')],
          },
        });
        return true;
      }
      return false;
    }
  }



  

  
)//form