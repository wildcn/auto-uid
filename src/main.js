#! /usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const shell = require( 'shelljs' );


const APP_ROOT = path.resolve(__dirname, '..');
let PROJECT_ROOT = process.env.PWD;

const packJSON = require( `${APP_ROOT}/package.json` );
const config = require( `${APP_ROOT}/config.json` );

var program = require('commander');

program
    .version( config.version )
    .option('-p, --path <path>', '设置项目路径' )
    ;
program.parse(process.argv);

PROJECT_ROOT = program.path || PROJECT_ROOT;

console.log( PROJECT_ROOT );

require('babel-core/register');
require("babel-polyfill");
const init = require( './app' ).init;
//init( APP_ROOT, PROJECT_ROOT, packJSON, osName, cityName );
