import React, {Component} from 'react';
import FormJson from './form/json';
import FormXml from './form/xml';
import FormPhp from './form/php';
import FormDefault from './form/default';

export default class Form extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    getForm() {
        switch (this.props.format) {
            case 'json':
                return (
                    <FormJson text={this.props.text}/>
                );
            case 'xml':
                return (
                    <FormXml text={this.props.text}/>
                );
            case 'php':
                return (
                    <FormPhp text={this.props.text}/>
                );
            default:
                return (
                    <FormDefault text={this.props.text}/>
                );
        }
    }

    render() {
        return (
            <div>
                {this.getForm()}
            </div>
        );
    }
}
