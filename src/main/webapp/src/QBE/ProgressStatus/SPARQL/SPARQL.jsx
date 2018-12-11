import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Modal} from 'antd';

export class SPARQL extends Component{

    render(){
        let lines = this.props.sparql.split("\n").map((line,i) => <p key={i}>{line}</p>);
        return (
        <Modal
            title="SPARQL Query"
            visible={this.props.visible}
            onOk={this.props.handleOk}
            onCancel={this.props.handleCancel}
            footer={null}
          >
            {lines}
          </Modal>)
          ;
    }
}

SPARQL.propTypes = {
    sparql: PropTypes.string,
    visible: PropTypes.bool,
    handleOk: PropTypes.func,
    handleCancel: PropTypes.func
}