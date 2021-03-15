import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [{
        input: 'build/index.js',
        plugins: [commonjs(), resolve(), sourcemaps()],
        output: {
            file: 'build/index.umd.js',
            format: 'umd',
            name: '@divine.ghostly-runtime',
            amd: {
                id: '@divine/ghostly-runtime'
            },
            sourcemap: true,
        },
    }, {
        input: 'build/index.legacy.js',
        plugins: [commonjs(), resolve(), sourcemaps()],
        output: {
            file: 'build/index.legacy.umd.js',
            format: 'umd',
            name: 'ghostly',
            amd: {
                id: 'ghostly'
            },
            sourcemap: true,
        },
    }
];
