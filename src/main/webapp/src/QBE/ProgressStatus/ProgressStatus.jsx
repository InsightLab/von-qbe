import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Steps, Icon } from 'antd';

import {SPARQL} from './SPARQL/SPARQL'

import 'antd/dist/antd.css'
import './ProgressStatus.css'

const Step = Steps.Step;

export class ProgressStatus extends Component{

    constructor(props){
        super(props);

        this.state = {"modalVisible" : false};

        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    showModal(e) {
        this.setState({
          "modalVisible": true,
        });
    }
    
    closeModal(e) {
        this.setState({
            "modalVisible": false,
        });
    }

    render(){
        return(
            <Steps id="progress-status">
                {this.props.sparql && <SPARQL 
                    sparql={this.props.sparql}
                    visible={this.state.modalVisible}
                    handleOk={this.closeModal}
                    handleCancel={this.closeModal}
                /> }
                
                <Step 
                    id={(this.props.status >0) ? "sparql-step" : ""}
                    status={
                        (this.props.status < 1) ? "wait" : 
                        ((this.props.status === 0) ? "process" : "finish")} 
                    title="Sparql Generation" 
                    icon={<Icon type={(this.props.status === 0) ? "loading" : "form"} />} 
                    onClick={this.showModal}
                />

                <Step 
                    status={
                        (this.props.status < 2) ? "wait" : 
                        ((this.props.status === 1) ? "process" : "finish")} 
                    title="Sparql Execution" 
                    icon={<Icon type={(this.props.status === 1) ? "loading" : "hdd"} />}
                /> 

                <Step 
                    status={
                        (this.props.status < 3) ? "wait" : 
                        ((this.props.status === 2) ? "process" : "finish")}
                    title="Mapping Results"
                    icon={<Icon type={(this.props.status === 2) ? "loading" : "snippets"} />}  
                />

                <Step
                    status={
                        (this.props.status < 3) ? "wait" : "finish"}
                    title="Done" 
                    icon={<Icon type={(this.props.status > 2) ? "smile" : "frown"} />}  
                />
            </Steps>
          );
    }

}

ProgressStatus.propTypes = {
    status: PropTypes.number,
    sparql: PropTypes.string
}