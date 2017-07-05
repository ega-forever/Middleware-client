module.exports = {
    "env": {
        "browser": false,
        "jest": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [],
    "rules": {
        "indent": [
          "error", 2, {
            "SwitchCase": 1
          }
        ],
        "semi": ["error"],
        "no-console": 1,
        "no-unused-vars": 1,
        "no-case-declarations": 1
    }
};
