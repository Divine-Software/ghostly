import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [{
        input: 'lib/src/index.js',
        plugins: [commonjs(), resolve(), sourcemaps()],
        output: {
            file: 'lib/bundle.umd.js',
            format: 'umd',
            name: '@divine.ghostly-runtime',
            amd: {
                id: '@divine/ghostly-runtime'
            },
            sourcemap: true,
        },
    }, {
        input: 'lib/src/legacy.js',
        plugins: [commonjs(), resolve(), sourcemaps()],
        output: {
            file: 'lib/legacy.umd.js',
            format: 'umd',
            name: 'ghostly',
            amd: {
                id: 'ghostly'
            },
            sourcemap: true,
        },
    }
];
