"use strict";
const resolve = require('path').resolve;

const alias = {
    "_backendRouter":   resolve(__dirname, '..', 'route', 'backendRoute.tsx'),
    "_block":           resolve(__dirname, '..', 'view', 'blocks'),
    "_component":       resolve(__dirname, '..', 'view', 'components'),
    "_page":            resolve(__dirname, '..', 'view', 'pages'),
    "_server":          resolve(__dirname, '..', 'server'),
    "_serverConfig":    resolve(__dirname, '..', 'server', "config.ts"),
    "_serverRoute":     resolve(__dirname, '..', 'server', "router"),
    "_store":           resolve(__dirname, '..', 'store'),
    "_stores":          resolve(__dirname, '..', 'store', 'index.ts'),
    "_view":            resolve(__dirname, '..', 'view'),
    "_utils":           resolve(__dirname, '..', 'utils'),
};
exports.default = alias;