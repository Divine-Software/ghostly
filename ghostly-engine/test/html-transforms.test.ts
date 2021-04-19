import { URI } from '@divine/uri';
import { HTMLTransforms } from '../src/html-transforms';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { sanitizeConfig } from '../src/playwright-driver';

const DOMPurify = createDOMPurify(new JSDOM('').window as any);
const sanitizer = async (content: string, fragment: boolean) => DOMPurify.sanitize(content, sanitizeConfig(fragment));

describe('the transformer', () => {
    it.each([
        'identity',
        'inline',
        'minimize',
        'sanitize',
        'inline,minimize',
        'inline,sanitize',
        'inline,sanitize,minimize',
    ])('can run %s transforms', async (transforms) => {
        expect.assertions(1);

        const docURI = new URI('test/data/html-transforms.test.html');
        const result = await new HTMLTransforms(docURI.href, { logger: console, templatePattern: /.*/ }, sanitizer)
            .apply(String(await docURI.load('text/plain')), { contentType: 'text/html', htmlTransforms: transforms.split(',') as any });

        // Write result for manual inspection and then check against snapshot
        await URI.$`test/data/_html-transforms.${transforms}.html`.save(result);
        expect(result).toMatchSnapshot();
    });
});
