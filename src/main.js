#! /usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const shell = require( 'shelljs' );
const merge = require('deepmerge')

const APP_ROOT = path.resolve(__dirname, '..');
let PROJECT_ROOT = process.env.PWD;

const packJSON = require( `${APP_ROOT}/package.json` );
const config = require( `${APP_ROOT}/config.json` );

var program = require('commander');

program
    .version( packJSON.version )
    .option('-a, --all', '处理所有匹配的文件' )
    .option('-p, --path <path>', '设置项目路径' )
    ;
program.parse(process.argv);

PROJECT_ROOT = program.path || PROJECT_ROOT;

const projectInfo = resolveProjectInfo( PROJECT_ROOT );

PROJECT_ROOT = projectInfo.projectRoot;

require('babel-core/register');
require("babel-polyfill");
const init = require( './app' ).init;
init( APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo );

function resolveProjectInfo( proot ){
    let r = {};
    r.projectRoot = proot;
    r.currentRoot = proot;
    r.appRoot = APP_ROOT;
    r.packagePath = '';

    let tmpPath = proot;
    while( true ){
        let tmpFile = path.join( tmpPath, 'package.json' );

        if( fs.existsSync( tmpFile ) ){
            r.packagePath = tmpFile;
            r.projectRoot = tmpPath;
            break;
        }else{
            if( tmpPath.length === 1 ){
                break;
            }
            tmpPath = path.join( tmpPath, '../' );
        }
    }

    r.feuid = merge.all( [
        {}
        , fs.existsSync( `${r.appRoot}/feuid.js` ) 
            ? require( `${r.appRoot}/feuid.js` ) : {}
        , fs.existsSync( `${r.projectRoot}/feuid.js` ) 
            ? require( `${r.projectRoot}/feuid.js` ) : {}
        , fs.existsSync( `${r.currentRoot}/feuid.js` ) 
            ? require( `${r.currentRoot}/feuid.js` ) : {} 
    ], { arrayMerge: (destinationArray, sourceArray, options) => sourceArray });

    return r;
}

