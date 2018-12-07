import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Steps, Icon } from 'antd';
import 'antd/dist/antd.css'
import './ProgressStatus.css'
const Step = Steps.Step;

export class ProgressStatus extends Component{

    render(){
        return(
            <Steps id="progress-status">
                <Step 
                    status={
                        (this.props.status < 1) ? "wait" : 
                        ((this.props.status === 0) ? "process" : "finish")} 
                    title="Sparql Generation" 
                    icon={<Icon type={(this.props.status === 0) ? "loading" : "form"} />} 
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
}