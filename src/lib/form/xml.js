import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Button, Select, MenuItem} from 'material-ui';
import HTMLTree from 'react-htmltree';
import {pd} from 'pretty-data';
import {Controlled as CodeMirror} from 'react-codemirror2';
import ReactDOM from 'react-dom';
import '../style.css';

require('codemirror/mode/xml/xml');

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
            case 'tree':
                return this.treeviewPrint(text);
            default:
                return this.defaultPrint(text);
        }
    }

    defaultPrint(text) {
        return (
            <pre dangerouslySetInnerHTML={{__html: this.prettyText(text)}}/>
        );
    }

    highlightPrint(text) {
        return (
            <CodeMirror
                value={this.prettyText(text)}
                options={{mode: 'xml', lineNumbers: true}}
            />
        );
    }

    treeviewPrint(text) {
        let defaultExpandedTags = [];
        defaultExpandedTags.indexOf = function () {
            return 0;
        };
        return <HTMLTree source={text} defaultExpandedTags={defaultExpandedTags}/>;
    }

    prettyText(text) {
        if (!text) {
            return '';
        }

        return pd.xml(text);
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
                                <MenuItem value={'tree'}>Tree</MenuItem>
                            </Select>
                        </td>
                        <td>
                            <CopyToClipboard
                                text={this.props.text}
                                onCopy={() => this.handleCopy()}
                            >
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
