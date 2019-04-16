

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
        this.info = this.app.projectInfo;

        this.newFile = [];
        this.modifiedFile = [];
        this.allFile = [];

        this.init();
    }

    init() {
    }

    initMethod() {
        console.log( 'initMethod', Date.now() );
    }

    getChangeFiles(){
        let info = this.info;

        let gitStatus = shell.exec( `cd '${info.currentRoot}' && git status`, { silent: true } );


        let lines = gitStatus.stdout.split( '\n' );

        let p = this;

        lines.map( ( item, index ) => {
            item = item.trim();
            item.replace( /new[\s]+file:[\s]+(.*)/, function( $0, $1 ){
                let fullpath = path.join( info.currentRoot, $1 );
                let filepath =  fullpath.replace( info.projectRoot, '' );
                if( info.feuid.extension.test( $1 )
                    && info.feuid.dir.test( filepath )
                ){
                    //console.log( 'find new file:', $1 );
                    p.newFile.push( fullpath );
                    p.allFile.push( fullpath );
                }
            });
            item.replace( /modified:[\s]+(.*)/, function( $0, $1 ){
                let fullpath = path.join( info.currentRoot, $1 );
                let filepath =  fullpath.replace( info.projectRoot, '' );
                if( info.feuid.extension.test( $1 )
                    && info.feuid.dir.test( filepath )
                ){
                    //console.log( 'find new modified:', $1 );
                    p.modifiedFile.push( fullpath );
                    p.allFile.push( fullpath );
                }
            });
        });
    }


}
