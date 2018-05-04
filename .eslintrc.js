// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    env: {
        browser: false,
    },
    extends: [
        // 'airbnb-base',
    ],
    plugins: [
        'flowtype-errors',
    ],
    rules: {
        'flowtype-errors/show-errors': 2, // <- show flowtype errors
        'global-require': 0, // <- Makes many of our files more confusing.
        'import-extensions': 0, // <- This is just silly, webpack handles this for us. Extensions should only be required if import is otherwise ambiguous.
        'indent': ['error', 4], // <- 4 space indentation
        'linebreak-style': 0,
        'no-console': 0, // <- disable until we figure out a way to make it warn
        'no-debugger':  1, // <- only allow debugger in development
        'no-param-reassign': 0, // <- This causes issues with vuex mutators. // Kyle likes it if we can ignore mutators
        'no-shadow': 0, // <- This causes issues in single file stores. Maybe make it warn? Kylan likes warn
        'no-underscore-dangle': 0, // <- Vue does this itself, and there are places it makes sense for us to do it as well.
        'no-unused-expressions': ['error', { "allowTernary": true }], // <- overriding default to allow ternary in this case
        'prefer-default-export': 0,
        'import/newline-after-import': 0,
        'max-len': ['error', 100, 2, {
            ignoreUrls: true,
            ignoreComments: true,
            ignorePattern: '(^function )|( function )|(=>)|(.*(.*).*{.*)',
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
        'no-unused-vars': ['warn'],
        'prefer-default-export': 0,
    },
}