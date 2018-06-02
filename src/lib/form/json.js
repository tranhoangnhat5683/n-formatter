import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {TextField, Checkbox, Button} from 'material-ui';
import JsonViewer from 'react-json-view';
import {Controlled as CodeMirror} from 'react-codemirror2';
import ReactDOM from 'react-dom';
require('codemirror/mode/javascript/javascript');
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

    handleChange(e, key) {
        this.setState({
            [key]: e.target.value,
        });
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
        let obj = this.parseJSON(text);
        this.recursiveFilter(obj, filterText);
        return JSON.stringify(obj);
    }

    recursiveFilter(obj, text) {
        if (Array.isArray(obj)) {
            let flag = false;
            for (let i = obj.length - 1; i >= 0; i--) {
                if (this.recursiveFilter(obj[i], text)) {
                    flag = true;
                } else {
                    obj.splice(i, 1);
                }
            }
            return flag;
        } else if (typeof obj === 'object') {
            let flag = false;
            for (let key in obj) {
                if (this.recursiveFilter(obj[key], text) || this.recursiveFilter(key, text)) {
                    flag = true;
                } else {
                    delete obj[key];
                }
            }
            return flag;
        } else {
            return (obj + '').search(text) !== -1
        }
    }

    defaultPrint(text) {
        return (
            <pre
                className="formatter-pre"
                dangerouslySetInnerHTML={{__html: this.prettyText(text)}}
            />
        );
    }

    highlightPrint(text) {
        return (
            <CodeMirror
                value={this.prettyText(text)}
                options={{mode: 'javascript', lineNumbers: true}}
            />
        );
    }

    treeviewPrint(text) {
        return <JsonViewer src={this.parseJSON(text)}/>;
    }

    prettyText(text) {
        if (!text) {
            return '';
        }

        let obj = this.parseJSON(text);
        return JSON.stringify(obj, undefined, 2);
    }

    parseJSON(text) {
        try {
            return JSON.parse(text);
        } catch (e) {
            return '';
        }
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <TextField
                                value={this.state.filter}
                                placeholder={'Filter by key'}
                                onChange={e => this.handleChange(e, 'filter')}
                            />
                        </td>
                        <td>
                            <Checkbox
                                checked={this.state.highlight}
                                onChange={() => this.toggle('highlight')}
                            />
                            Highlight
                        </td>
                        <td>
                            <Checkbox
                                checked={this.state.treeview}
                                onChange={() => this.toggle('treeview')}
                            />
                            Tree
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
