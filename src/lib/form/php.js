import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Checkbox, Button} from 'material-ui';
import {Controlled as CodeMirror} from 'react-codemirror2';
import ReactDOM from 'react-dom';
require('codemirror/mode/php/php');
import '../style.css';

export default class Form extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            highlight: true,
        };
    }

    getText() {
        return this.props.text;
    }

    toggle(key) {
        this.setState({
            [key]: !this.state[key],
        });
    }

    handleCopy() {
        if (this.input) {
            const input = ReactDOM.findDOMNode(this.input);
            if (input) {
                input.select();
            }
        }
    }

    renderViewer() {
        let text = this.getText();
        if (this.state.filter) {
            text = this.applyFilter(text, this.state.filter);
        }

        if (this.state.treeview) {
            return this.treeviewPrint(text);
        }

        if (this.state.highlight) {
            return this.highlightPrint(text);
        }

        return this.defaultPrint(text);
    }

    applyFilter(text, filterText) {
    }

    defaultPrint(text) {
        return (
            <pre className="formatter-pre" dangerouslySetInnerHTML={{__html: text}}/>
        );
    }

    highlightPrint(text) {
        return (
            <CodeMirror
                value={text}
                options={{mode: 'php', lineNumbers: true}}
            />
        );
    }

    treeviewPrint(text) {
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <Checkbox
                                checked={this.state.highlight}
                                onChange={() => this.toggle('highlight')}/>
                            Highlight
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
