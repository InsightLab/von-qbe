import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Upload, Button, Icon, //message,
} from 'antd';
//import reqwest from 'reqwest';

export class UploadUi extends Component {
  
  static propTypes = {
    accept: PropTypes.string,
    clear: PropTypes.bool,
  };

  state = {
    fileList: [],
    uploading: false
  }

  componentWillReceiveProps(newProps){
    if(newProps.clear)
      this.setState({fileList: []});  
  }

  render() {
    const {  fileList } = this.state;
    //const { fileList } = this.props;
    const { onChangeFile } = this.props; 
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        onChangeFile(file);
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Upload {...props} accept={this.props.accept}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
      </div>
    );

  }
 
}