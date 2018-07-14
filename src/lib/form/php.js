import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Button, Select, MenuItem} from 'material-ui';
import {Controlled as CodeMirror} from 'react-codemirror2';
import ReactDOM from 'react-dom';
import '../style.css';
require('codemirror/mode/php/php');

export default class Form extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            format: 'highlight',
        };
    }

    getText() {
        return this.props.text;
    }

    handleCopy() {
        if (this.input) {
            const input = ReactDOM.findDOMNode(this.input);
            if (input) {
                input.select();
            }
        }
    }

    handleChange(e, key) {
        this.setState({
            [key]: e.target.value,
        });
    }

    renderViewer() {
        let text = this.getText();

        switch (this.state.format) {
            case 'highlight':
                return this.highlightPrint(text);
            default:
                return this.defaultPrint(text);
        }
    }

    defaultPrint(text) {
        return (
            <pre dangerouslySetInnerHTML={{__html: text}}/>
        );
    }

    highlightPrint(text) {
        return (
            <CodeMirror
                value={text}
                options={{mode: 'text/x-php', lineNumbers: true}}
            />
        );
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <Select
                                value={this.state.format}
                                onChange={(e) => this.handleChange(e, 'format')}
                            >
                                <MenuItem value={'none'}>None</MenuItem>
                                <MenuItem value={'highlight'}>Highlight</MenuItem>
                            </Select>
                        </td>
                        <td>
                            <CopyToClipboard
                                text={this.props.text}
                                onCopy={() => this.handleCopy()}>
                                <Button
                                    variant="raised"
                                    color="primary">
                                    Copy
                                </Button>
                            </CopyToClipboard>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    {this.renderViewer()}
                </div>
            </div>
        );
    }
}
