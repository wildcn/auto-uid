#! /usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const shell = require( 'shelljs' );
const get_args = require('./utils/get_args.js');


const APP_ROOT = path.resolve(__dirname, '..');
let PROJECT_ROOT = process.env.PWD;

const packJSON = require( `${APP_ROOT}/package.json` );
const config = require( `${APP_ROOT}/config.json` );

/*
console.log( APP_ROOT );
console.log( PROJECT_ROOT );
console.dir( config );
*/

var program = require('commander');

program
  .version( config.version, '-v, --version' )
  //.option('-b, --bbq-sauce', 'Add bbq sauce')
  .parse(process.argv);

require('babel-core/register');
require("babel-polyfill");
const init = require( './app' ).init;
//init( APP_ROOT, PROJECT_ROOT, packJSON, osName, cityName );
