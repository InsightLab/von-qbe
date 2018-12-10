import React, { Component } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import {UploadUi} from './Upload';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

export const UploadModal = 
Form.create()(
  class extends Component {

    static propTypes = {
      onOk: PropTypes.func,
      onCancel: PropTypes.func,
      loading: PropTypes.bool,
      visible: PropTypes.bool,
    } 

    render() {
      //const styleUpload = { marginTop: 5 };
      const {onOk, onCancel, loading, visible} = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <Modal
          title="New Database"
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          footer={[
            <Button key="back" onClick={onCancel}>Cancel</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={onOk}>
              Save
            </Button>
          ]}>
          <Form onSubmit={this.handleSubmit}>
            {/* Name:<Input placeholder="Name Database"/>
            <div style={styleUpload}>File1:<UploadUi /></div>
            <div style={styleUpload}>File2:<UploadUi /></div>
            <span style={styleUpload}>File3:<UploadUi /></span> */}
            <FormItem
              label="Name"
            >
              {getFieldDecorator('name', {
                   rules: [{
                    required: true,
                    message: 'Please input your name',
                  }],
                })(
                <Input placeholder="Name Database"/>
              )}
            </FormItem>
            <FormItem
              label="File1"
              >
              <div className="dropbox">
                {getFieldDecorator('file1', {
                   rules: [{
                    required: true,
                    message: 'Please input your File 1',
                  }],
                })(
                  <UploadUi />
                )}
              </div>
            </FormItem>
            <FormItem
              label="File2"
              >
              <div className="dropbox">
                {getFieldDecorator('file2', {
                   rules: [{
                    required: true,
                    message: 'Please input your File 2',
                  }],
                })(
                  <UploadUi />
                )}
              </div>
            </FormItem>
            <FormItem
              label="File3"
              >
              <div className="dropbox">
                {getFieldDecorator('file3', {
                   rules: [{
                    required: true,
                    message: 'Please input File 3',
                  }],
                })(
                  <UploadUi />
                )}
              </div>
            </FormItem>
          </Form>
        </Modal>
      )
    }

  }
)//form