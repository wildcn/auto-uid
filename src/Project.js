

import fs from "fs";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import shell from 'shelljs';

import inquirer from 'inquirer';

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;

import * as CONST from './data/constant.js';
import * as DATA from './data/data.js';

export default class Project {
    constructor( app ){
        this.app = app;

        this.gitRoot = this.app.projectRoot;

        this.newFile = [];
        this.modifiedFile = [];

        this.init();
    }

    init() {
    }

    initMethod() {
        console.log( 'initMethod', Date.now() );
    }

    getChangeFiles(){
        let gitStatus = shell.exec( `cd '${this.app.projectRoot}' && git status`, { silent: true } );


        let lines = gitStatus.stdout.split( '\n' );

        lines.map( ( item, index ) => {
            item = item.trim();
            item.replace( /new[\s]+file:[\s]+(.*)/, function( $0, $1 ){
                //console.log( 'find new file:', $1 );
            });
            item.replace( /modified:[\s]+(.*)/, function( $0, $1 ){
                //console.log( 'find new modified:', $1 );
            });
        });
    }

    resolveGitRoot(){
        console.log( 'this.app.projectRoot:', this.app.projectRoot );


        let tmpPath = this.app.projectRoot;
        while( true ){
            let tmpFile = path.join( tmpPath, 'package.json' );

            if( fs.existsSync( tmpFile ) ){
                console.log( 'tmpFile', tmpFile );
                break;
            }else{
                if( tmpPath.length === 1 ){
                    break;
                }
                tmpPath = path.join( tmpPath, '../' );
            }
        }

        
        console.log( 'this.gitRoot:', this.gitRoot );
    }


}
