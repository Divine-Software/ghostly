import { Engine } from '@divine/ghostly-engine';

const TEMPLATE = 'https://divine-software.github.io/ghostly/examples/ghostly-plainjs-template.html';
const MODEL    = [ null, "one", 2, { "three": [ false, true ] } ];
const MODEL_CT = 'application/json';

(async () => {
    const engine = await new Engine({
        logger: console,
        pageCache: 10,
        workers: 1,
    }).start();

    const template = engine.template(TEMPLATE);
    const textBuff = await template.render(MODEL, MODEL_CT, 'text/plain; charset=utf-8');

    console.log(textBuff.toString())
    await engine.stop();
})();
