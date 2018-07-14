import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Button} from 'material-ui';
import ReactDOM from "react-dom";

export default class Form extends Component {
    renderViewer() {
        let text = this.getText();
        return this.defaultPrint(text);
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

    defaultPrint(text) {
        return (
            <pre dangerouslySetInnerHTML={{__html: text}}/>
        );
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
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
