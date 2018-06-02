import React, { Component } from 'react';

export default class FormRight extends Component {
    render() {
        return (
            <div>
                <pre>{this.props.text}</pre>
            </div>
        );
    }
}
