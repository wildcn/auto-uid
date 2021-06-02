
import fs from "fs-extra";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

import shell from 'shelljs';

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;

import * as CONST from './data/constant.js';
import * as DATA from './data/data.js';

import ProjectReplaceVUE from './ProjectReplaceVUE.js';

export default class App {
    constructor( appRoot, projectRoot, packJSON, config, program, projectInfo ) {

        this.appRoot = appRoot;
        this.projectRoot = projectRoot;
        this.packJSON = packJSON;   
        this.config = config;
        this.program = program;
        this.projectInfo = projectInfo;

        /*
        console.log( info( packJSON.name ) );
        console.log( [ 
            'appRoot: ' + this.appRoot
            , 'projectRoot: ' + this.projectRoot 
            ].join("\n") );
        */

        this.init();
    }

    init() {
        if( (!shell.which( 'git' ) ) ){
            console.error( error( 'auto-uid - git not exists' ) );
            return;
        }
        // 检查git缓存区
        

        if( (!fs.existsSync( `${this.projectInfo.gitRoot}/.git` ) ) ){
            console.error( error( 'auto-uid - dir is not git' ) );
            return;
        }


        this.project = new ProjectReplaceVUE( this );
    }

    fileExists( file ) {
        return fs.existsSync( file );
    }

}

export function init( APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo ){
    let AppIns = new App( APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo ); 
}

