import { PreviewDriver } from '@divine/ghostly-runtime';
import React, { Component } from 'react';
import styles from './styles.module.css';
import config from '../../../docusaurus.config';
import { extension } from 'mime-types';

export class TemplatePreview extends Component {
    render() {
        return <iframe name={this.props.name} className={styles.iframe} scrolling='no'></iframe>
    }
}

function absPath(path) {
    const prefix = typeof location !== 'undefined' ? `${location.protocol}//${location.host}` : '';

    return `${prefix}${config.baseUrl}${path}`
}

export class TemplateParams extends Component {
    static presets = [
        {
            name: 'Plain JS Template',
            url:  absPath('examples/ghostly-plainjs-template.html'),
            model: {
                "glossary": {
                    "title": "example glossary",
                    "GlossDiv": {
                        "title": "S",
                        "GlossList": {
                            "GlossEntry": {
                                "ID": "SGML",
                                "SortAs": "SGML",
                                "GlossTerm": "Standard Generalized Markup Language",
                                "Acronym": "SGML",
                                "Abbrev": "ISO 8879:1986",
                                "GlossDef": {
                                    "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                    "GlossSeeAlso": ["GML", "XML"]
                                },
                                "GlossSee": "markup"
                            }
                        }
                    }
                }
            },
            params: '',
        },
        {
            name:  'Angular Templage',
            url:   absPath('examples/ghostly-angular-template/index.html#ghostly-template'),
            model: {
                'name':     'John Doe',
                'username': 'johndoe',
                'email':    'john@doe.com'
            },
            params: '',
        }
    ].map(({ name, url, model, params }) => ({ name, url, model: JSON.stringify(model, null, 4), params }));

    constructor(props) {
        super(props);

        this.target = props.target;
        this.state  = { ...TemplateParams.presets[0], busy: false, extras: [] };
    }

    newPreset = (ev) => {
        this.setState({ ...TemplateParams.presets.find((p) => p.url === ev.target.value) })
    }

    newURL = (ev) => {
        this.setState({ url: ev.target.value });
    }

    newModel = (ev) => {
        this.setState({ model: ev.target.value });
    }

    newParams = (ev) => {
        this.setState({ params: ev.target.value });
    }

    renderModel = async (ev, print) => {
        ev.preventDefault();

        try {
            this.setState({ busy: true, extras: [] });

            const driver = new PreviewDriver(this.target, (ev) => alert(`Event from ${this.state.url}: ${JSON.stringify(ev)}`));
            const extras = await driver.renderPreview(this.state.url, this.state.model, 'application/json', this.state.params ? JSON.parse(this.state.params) : undefined);

            this.setState({ extras });

            if (print) {
                driver.print();
            }
        }
        catch (err) {
            alert(err);
        }
        finally {
            this.setState({ busy: false });
        }

        return false;
    }

    displayAttachment = (ev, info) => {
        ev.preventDefault();

        const bin = info.data instanceof Uint8Array
            ? info.data
            : Uint8Array.from(Array.from(typeof info.data === 'string' ? info.data : JSON.stringify(info.data)).map((c) => c.charCodeAt(0)));

        const url = URL.createObjectURL(new Blob([bin.buffer], { type: info.contentType }));
        window.open(url);
        URL.revokeObjectURL(url);

        return false;
    }

    render() {
        const selected = TemplateParams.presets.find((p) =>
                p.url    === this.state.url &&
                p.model  === this.state.model &&
                p.params === this.state.params
            )?.url ?? '';

        return <form onSubmit={() => false}>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor='preset'>Preset</label>
                        </th>
                        <td>
                            <select name='preset' value={selected} onChange={this.newPreset}>
                                { TemplateParams.presets.map((p) => <option key={p.url} value={p.url}>{p.name}</option>) }
                                { !selected && <option key={selected} value={selected}>Custom Template</option> }
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='template'>Template URL</label>
                        </th>
                        <td>
                            <input name='template' type='text' value={this.state.url} onChange={this.newURL} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='model'>Model (JSON)</label>
                        </th>
                        <td>
                            <textarea name='model'value={this.state.model} onChange={this.newModel} rows='10'></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label htmlFor='params'>View params<br/>(optional; JSON)</label>
                        </th>
                        <td>
                            <textarea name='params' value={this.state.params} onChange={ev => this.newParams(ev)} rows='5'></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            &nbsp;
                        </th>
                        <td>
                            <span>
                                <button className='button button--primary' disabled={this.state.busy} onClick={(ev) => this.renderModel(ev, false)}>Render model as HTML</button>
                                &nbsp;
                                <button className='button button--primary' disabled={this.state.busy} onClick={(ev) => this.renderModel(ev, true)}>Render model and print</button>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Attachments
                        </th>
                        <td>
                            <span>
                                { this.state.extras.map((a) => [
                                    <button key={a.name} className='button button--sm button--outline button--info' title={a.description} onClick={(ev) => this.displayAttachment(ev, a)}>
                                        {a.name}.{extension(a.contentType) ?? 'bin'}
                                    </button>,
                                    '\xa0',
                                ])}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    }
}
