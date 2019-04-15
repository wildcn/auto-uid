#! /usr/bin/env node
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var shell = require('shelljs');
var get_args = require('./utils/get_args.js');

var APP_ROOT = path.resolve(__dirname, '..');
var PROJECT_ROOT = process.env.PWD;

var packJSON = require(APP_ROOT + '/package.json');
var config = require(APP_ROOT + '/config.json');

/*
console.log( APP_ROOT );
console.log( PROJECT_ROOT );
console.dir( config );
*/

var program = require('commander');

program.version(config.version, '-v, --version').option('-p, --peppers', 'Add peppers').option('-P, --pineapple', 'Add pineapple').option('-b, --bbq-sauce', 'Add bbq sauce').option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble').parse(process.argv);

require('babel-core/register');
require("babel-polyfill");
var init = require('./app').init;
//init( APP_ROOT, PROJECT_ROOT, packJSON, osName, cityName );