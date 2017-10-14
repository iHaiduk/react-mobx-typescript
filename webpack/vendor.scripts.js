"use strict";

const {resolve} = require('path');

var walkSync = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

const vendor = [
    'react',
    'react-dom',
    'react-router',
    'react-helmet',

    'mobx',
    'mobx-react',
    'mobx-react-router',

    'history',
    'axios',
    'picturefill',
    'classnames/dedupe',

];
// exports.default = vendor;
exports.default = [].concat(vendor, walkSync(resolve(__dirname, "..", "utils")));