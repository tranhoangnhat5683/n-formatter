import React, { Component } from 'react';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'reactstrap';
import MDTextField from 'components/Material/TextField';
import JsonViewer from 'components/JsonViewer';
import MDCheckbox from 'material-ui/Checkbox';
import emitter, { PAGE_EVENT } from 'helpers/emitter';
import { Controlled as CodeMirror } from 'components/CodeMirror';
import ReactDOM from 'react-dom';
import * as api from 'utils/apis/short';

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
        var value = !this.state[key];
        this.setState({
            [key]: value,
        });
        emitter.emit(
            PAGE_EVENT,
            {},
            {
                action: 'highlight',
                category: 'JSON Convertor',
                label: 'Toogle Highlight',
                value: value,
            }
        );
    }

    toggleShare() {
        const openShare = !this.state.openShare;
        this.setState({ openShare: openShare });
        emitter.emit(
            PAGE_EVENT,
            {},
            {
                action: 'share',
                category: 'JSON Convertor',
                label: 'Toogle Share',
                value: openShare,
            }
        );
    }

    handleCopy() {
        if (this.input) {
            const input = ReactDOM.findDOMNode(this.input);
            if (input) {
                input.select();
            }
        }
        emitter.emit(
            PAGE_EVENT,
            {},
            {
                action: 'copy',
                category: 'JSON Convertor',
                label: 'Copy',
                value: 0,
            }
        );
    }

    handleChange(e, key) {
        this.setState({
            [key]: e.target.value,
        });
        emitter.emit(PAGE_EVENT, e, {
            action: 'filter',
            category: 'JSON Convertor',
            label: 'Filter by Key',
            value: e.target.value,
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

    applyFilter(text, filterText) {
        let obj = this.parseJSON(text);
        this.filter(obj, filterText);
        return JSON.stringify(obj);
    }

    filter(obj, text) {
        if (Array.isArray(obj)) {
            let flag = false;
            for (let i = obj.length - 1; i >= 0; i--) {
                if (this.filter(obj[i], text)) {
                    flag = true;
                } else {
                    obj.splice(i, 1);
                }
            }
            return flag;
        } else if (typeof obj === 'object') {
            let flag = false;
            for (var key in obj) {
                if (this.filter(obj[key], text) || this.filter(key, text)) {
                    flag = true;
                } else {
                    delete obj[key];
                }
            }
            return flag;
        } else {
            if ((obj + '').search(text) === -1) {
                return false;
            }
            return true;
        }
    }

    defaultPrint(text) {
        const { styles } = this.props;
        return (
            <pre
                className={styles.pre}
                dangerouslySetInnerHTML={{ __html: this.prettyText(text) }}
            />
        );
    }

    highlightPrint(text) {
        const { styles } = this.props;
        return (
            <CodeMirror
                className={styles.editor}
                value={this.prettyText(text)}
                options={{ mode: 'javascript', lineNumbers: true }}
            />
        );
    }

    treeviewPrint(text) {
        return <JsonViewer src={this.parseJSON(text)} />;
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

    buildShareLinkViaServer() {
        var path = window.location.pathname;
        api
            .make({
                url: path,
                from: this.props.textFrom,
            })
            .then(response => {
                let data = response.data;
                alert(window.location.host + '/s' + '/' + data.name);
            });
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
                                [styles.tableFormGroupText]: true,
                            })}>
                            <MDTextField
                                value={this.state.filter}
                                placeholder={'Filter by key'}
                                onChange={e => this.handleChange(e, 'filter')}
                            />
                        </td>
                        <td
                            className={classnames({
                                [styles.tableFormGroupHighlight]: true,
                            })}>
                            <MDCheckbox
                                checked={this.state.highlight}
                                onChange={e => this.toggle('highlight')}
                            />
                            Highlight
                        </td>
                        <td
                            className={classnames({
                                [styles.tableFormGroupTree]: true,
                            })}>
                            <MDCheckbox
                                check={this.state.treeview}
                                onChange={e => this.toggle('treeview')}
                            />
                            Tree
                        </td>
                        <td
                            className={classnames({
                                [styles.tableFormGroupButton]: true,
                            })}>
                            <CopyToClipboard
                                text={this.prettyText(this.props.text)}
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
                <Share
                    text={this.props.textFrom}
                    openShare={this.state.openShare}
                    toggleShare={this.toggleShare}
                />
                <div>
                    {this.renderViewer()}
                </div>
            </div>
        );
    }
}
