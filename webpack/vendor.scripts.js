"use strict";

const {resolve, join} = require('path');
const {readdirSync, statSync} = require('fs');

const walkSync = function(dir, filelist) {
    const files = readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (statSync(join(dir, file)).isDirectory()) {
            filelist = walkSync(join(dir, file), filelist);
        }
        else {
            filelist.push(join(dir, file));
        }
    });
    return filelist;
};

const vendor = [
    'react',
    'react-dom',
    'react-router',
    'react-helmet',

    'react-select',

    'mobx',
    'mobx-react',
    'mobx-react-router',

    'history',
    'axios',
    'picturefill',
    'classnames/dedupe',

];

const bundle = [
    resolve(__dirname, "..", "route", "index.tsx"),
    resolve(__dirname, "..", "store", "index.ts")
];
// exports.default = vendor;
exports.default = [].concat(vendor, walkSync(resolve(__dirname, "..", "utils")));
exports.bundle = [].concat(bundle, walkSync(resolve(__dirname, "..", "view/components")));