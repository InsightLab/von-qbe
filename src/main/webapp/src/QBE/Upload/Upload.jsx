import React, { Component } from 'react';
import {
  Upload, Button, Icon, //message,
} from 'antd';
//import reqwest from 'reqwest';

export class UploadUi extends Component {
  
  state = {
    fileList: [],
    uploading: false,
    defaultFileList:[]
  }

  render() {
    const {  fileList, defaultFileList } = this.state;
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
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        {/* <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload' }
        </Button> */}
      </div>
    );

  }
  componentDidUpdate(){

    if (!this.props.visible){
      console.log('teste');
      this.setState({
        fileList: [],
      uploading: false,
      defaultFileList:[]
      })
    }

  }

}
