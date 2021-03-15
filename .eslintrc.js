module.exports = {
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:jest/all',
    ],
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        '@typescript-eslint/ban-types': [
            'error', {
                extendDefaults: true,
                types: {
                    'object': false
                }
            }
        ],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unused-vars': 0,
        'import/no-unresolved': 0,
        'no-constant-condition': [
            'error', {
                'checkLoops': false
            }
        ],
    }
};
