"use strict";
const resolve = require('path').resolve;

const alias = {
    "_store":           resolve(__dirname, '..', 'store'),
    "_stores":          resolve(__dirname, '..', 'store', 'index.ts'),
    "_view":            resolve(__dirname, '..', 'view'),
    "_utils":           resolve(__dirname, '..', 'utils'),
};
exports.default = alias;