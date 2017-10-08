"use strict";
const resolve = require('path').resolve;

const alias = {
    "_server": resolve(__dirname, '..', 'server'),
    "_serverConfig": resolve(__dirname, '..', 'server', "config.ts"),
    "_serverRoute": resolve(__dirname, '..', 'server', "router"),
    "_utils": resolve(__dirname, '..', 'utils'),
};
exports.default = alias;