import { PreviewDriver } from '@divine/ghostly-runtime';
import React, { Component } from 'react';
import styles from './index.module.css';
import config from '../../../docusaurus.config';

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
            name:  'Angular Templage #1',
            url:   absPath('examples/ghostly-angular-template/#ghostly-template'),
            model: {
                'name':     'John Doe',
                'username': 'johndoe',
                'email':    'john@doe.com'
            },
            params: '',
        },
        {
            name:  'Angular Templage #2a',
            url:   absPath('examples/ghostly-angular-template/#'),
            model: {
                name:     'Angular',
                title:    'ghostly-angular-template',
                github : {
                    org:  'angular',
                    repo: 'angular',
                },
                web : {
                    main: 'https://angular.io',
                    blog: 'https://blog.angular.io',
                    cli : 'https://cli.angular.io',
                },
                cli:      'ng',
                npm:      'angular',
                discord:  'angular',
                twitter:  'angular',
                youtube:  'angular',
            },
            params: '',
        },
        {
            name:  'Angular Templage #2b',
            url:   absPath('examples/ghostly-angular-template/#'),
            model: {
                name:     'Gradian',
                title:    'ghostly-gradian-template',
                github : {
                    org:  'gradian-org',
                    repo: 'gradian-repo',
                },
                web : {
                    main: 'https://gradian.io',
                    blog: 'https://blog.gradian.io',
                    cli : 'https://cli.gradian.io',
                },
                cli:      'gon',
                npm:      'gradianOnNPM',
                discord:  'gradianOnDiscord',
                twitter:  'gradianOnTwitter',
                youtube:  'gradianOnYoutube',
            },
            params: '',
        },
    ].map(({ name, url, model, params }) => ({ name, url, model: JSON.stringify(model, null, 4), params }));

    constructor(props) {
        super(props);

        this.target = props.target;
        this.state  = { ...TemplateParams.presets[0], busy: false, extras: [] };
        this.driver = new DebugDriver(this.target);
    }

    newPreset = (ev) => {
        this.setState({ ...TemplateParams.presets.find((p) => p.name === ev.target.value) })
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

    renderPreview = async (ev, print) => {
        ev.preventDefault();

        try {
            this.setState({ busy: true, extras: [] });

            const extras = await this.driver.renderPreview(this.state.url, this.state.model, 'application/json', this.state.params ? JSON.parse(this.state.params) : undefined);

            this.setState({ extras });

            if (print) {
                this.driver.print();
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

    clearPreview = async (ev) => {
        ev.preventDefault();

        try {
            this.setState({ busy: true, extras: [] });

            await this.driver.clearPreview();
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
            )?.name ?? '';

        return <form onSubmit={() => false}>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor='preset'>Preset</label>
                        </th>
                        <td>
                            <select name='preset' value={selected} onChange={this.newPreset}>
                                { TemplateParams.presets.map((p) => <option key={p.name} value={p.name}>{p.name}</option>) }
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
                            <textarea name='params' value={this.state.params} onChange={this.newParams} rows='5'></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            &nbsp;
                        </th>
                        <td>
                            <span>
                                <button className='button button--primary' disabled={this.state.busy} onClick={(ev) => this.renderPreview(ev, false)}>Preview model as HTML</button>
                                &nbsp;
                                <button className='button button--primary' disabled={this.state.busy} onClick={(ev) => this.renderPreview(ev, true)}>Preview model and print</button>
                                &nbsp;
                                <button className='button button--primary' disabled={this.state.busy} onClick={this.clearPreview}>Clear preview</button>
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
                                        {a.name}
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

class DebugDriver extends PreviewDriver {
    constructor(target) {
        super(target, (ev) => alert(`Event from ${this._template}: ${JSON.stringify(ev)}`));
    }

    async _invokeAndLog(method, args) {
        try {
            const result = await super[method](...args);

            console.info(method, args, result);
            return result;
        }
        catch (err) {
            console.error(method, args, err);
            throw err;
        }
    }

    ghostlyLoad(...args) {
        return this._invokeAndLog('ghostlyLoad', args);
    }

    ghostlyInit(...args) {
        return this._invokeAndLog('ghostlyInit', args);
    }

    ghostlyRender(...args) {
        return this._invokeAndLog('ghostlyRender', args);
    }

    ghostlyFetch(...args) {
        return this._invokeAndLog('ghostlyFetch', args);
    }

    ghostlyPreview(...args) {
        return this._invokeAndLog('ghostlyPreview', args);
    }

    ghostlyEnd(...args) {
        return this._invokeAndLog('ghostlyEnd', args);
    }
}