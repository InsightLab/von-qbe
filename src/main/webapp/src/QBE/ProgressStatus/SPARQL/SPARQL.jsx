import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal, Button} from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'

export class SPARQL extends Component{

  static propTypes = {
    sparql: PropTypes.string,
    visible: PropTypes.bool,
    handleOk: PropTypes.func,
    handleCancel: PropTypes.func
  }

  render(){
    let lines = this.props.sparql.split("\n").map((line,i) => <p key={i}>{line}</p>);
    return (
      <Modal
        title="SPARQL Query"
        visible={this.props.visible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={<CopyToClipboard text={this.props.sparql}><Button>Copy Sparql</Button></CopyToClipboard>}>
        {lines}
      </Modal>);
  }
};