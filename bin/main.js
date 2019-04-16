#! /usr/bin/env node
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var shell = require('shelljs');
var merge = require('deepmerge');

var APP_ROOT = path.resolve(__dirname, '..');
var PROJECT_ROOT = process.env.PWD;

var packJSON = require(APP_ROOT + '/package.json');
var config = require(APP_ROOT + '/config.json');

var program = require('commander');

program.version(packJSON.version).option('-p, --path <path>', '设置项目路径');
program.parse(process.argv);

PROJECT_ROOT = program.path || PROJECT_ROOT;

var projectInfo = resolveProjectInfo(PROJECT_ROOT);

PROJECT_ROOT = projectInfo.projectRoot;

require('babel-core/register');
require("babel-polyfill");
var init = require('./app').init;
init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);

function resolveProjectInfo(proot) {
    var r = {};
    r.projectRoot = proot;
    r.currentRoot = proot;
    r.packagePath = '';

    var tmpPath = proot;
    while (true) {
        var tmpFile = path.join(tmpPath, 'package.json');

        if (fs.existsSync(tmpFile)) {
            r.packagePath = tmpFile;
            r.projectRoot = tmpPath;
            break;
        } else {
            if (tmpPath.length === 1) {
                break;
            }
            tmpPath = path.join(tmpPath, '../');
        }
    }

    r.feuid = merge.all([{}, fs.existsSync(r.projectRoot + '/feuid.js') ? require(r.projectRoot + '/feuid.js') : {}, fs.existsSync(r.currentRoot + '/feuid.js') ? require(r.currentRoot + '/feuid.js') : {}], { arrayMerge: function arrayMerge(destinationArray, sourceArray, options) {
            return sourceArray;
        } });

    return r;
}