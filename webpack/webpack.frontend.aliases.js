"use strict";
const resolve = require('path').resolve;

const alias = {
    "_block":           resolve(__dirname, '..', 'view', 'blocks'),
    "_component":       resolve(__dirname, '..', 'view', 'components'),
    "_clientRouter":    resolve(__dirname, '..', 'route', 'index.tsx'),
    "_page":            resolve(__dirname, '..', 'view', 'pages'),
    "_store":           resolve(__dirname, '..', 'store'),
    "_stores":          resolve(__dirname, '..', 'store', 'index.ts'),
    "_stylesLoad":      resolve(__dirname, '..', 'styles'),
    "_style":           resolve(__dirname, '..', 'styles/index.ts'),
    "_view":            resolve(__dirname, '..', 'view'),
    "_utils":           resolve(__dirname, '..', 'utils'),
};
exports.default = alias;