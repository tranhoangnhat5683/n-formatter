import React, { Component } from 'react';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'reactstrap';
import MDCheckbox from 'material-ui/Checkbox';
import CodeMirror from 'react-codemirror2';
import ReactDOM from 'react-dom';

export default class FormRight extends Component {
    constructor(props, context) {
        super(props, context);
        this.toggleShare = this.toggleShare.bind(this);
        this.state = {
            openShare: false,
            highlight: true,
        };
    }

    toggle(key) {
        this.setState({
            [key]: !this.state[key],
        });
    }

    toggleShare() {
        const openShare = !this.state.openShare;
        this.setState({ openShare: openShare });
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
        let text = this.props.text;
        if (!text) {
            this.defaultPrint(text);
        }

        return this.prettyPrint(text);
    }

    prettyPrint(text) {
        const { styles } = this.props;
        if (this.props.fixed) {
            return <pre className={styles.pre}>{text}</pre>;
        }

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

    applyFilter(text, filterText) {}

    defaultPrint(text) {
        const { styles } = this.props;
        return (
            <pre className={styles.pre} dangerouslySetInnerHTML={{ __html: text }} />
        );
    }

    highlightPrint(text) {
        console.log(text);
        const { styles } = this.props;
        return (
            <CodeMirror
                className={styles.editor}
                value={text}
                options={{ mode: 'php', lineNumbers: true }}
            />
        );
    }

    treeviewPrint(text) {}

    buildShareLinkViaServer() {
    }

    render() {
        const { styles } = this.props;
        return (
            <div>
                <table
                    className={classnames({
                        [styles.tableFormGroup]: true,
                    })}>
                    <tr>
                        <td
                            className={classnames({
                                [styles.tablePhpFormGroupHighlight]: true,
                            })}>
                            <MDCheckbox
                                checked={this.state.highlight}
                                onChange={e => this.toggle('highlight')}
                            />
                            Highlight
                        </td>
                        <td
                            className={classnames({
                                [styles.tableFormGroupButton]: true,
                            })}>
                            <CopyToClipboard
                                text={this.props.text}
                                onCopy={e => this.handleCopy()}>
                                <Button color="primary">Copy</Button>
                            </CopyToClipboard>
                            <button
                                onClick={this.toggleShare}
                                className={classnames({
                                    'btn btn-primary': true,
                                    [styles.tableFormGroupShareBtn]: true,
                                })}>
                                Share
                            </button>
                            <button
                                onClick={() => this.buildShareLinkViaServer()}
                                className={classnames({
                                    'btn btn-primary': true,
                                })}>
                                Short
                            </button>
                        </td>
                    </tr>
                </table>
                <div>
                    {this.renderViewer()}
                </div>
            </div>
        );
    }
}
