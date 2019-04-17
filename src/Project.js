

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

        this.newRe = /new[\s]+file:[\s]+(.*)/;
        this.modifiedRe = /modified:[\s]+(.*)/;
        this.fixRe = /^(\/|\\)/;
        this.extensionRe = new RegExp( `\\.(vue)$`, 'i' );

        this.init();

    }

    init() {
    }

    initMethod() {
        console.log( 'initMethod', Date.now() );
    }

    getChangeFiles(){

        let gitStatus = shell.exec( `cd '${this.info.currentRoot}' && git status`, { silent: true } );
        let lines = gitStatus.stdout.split( '\n' );
        let p = this;

        lines.map( ( item, index ) => {
            item = item.trim();
            item.replace( p.newRe, function( $0, $1 ){
                p.fileReplaceAction( $0, $1, p.newFile )
            });

            item.replace( p.modifiedRe, function( $0, $1 ){
                p.fileReplaceAction( $0, $1, p.modifiedFile )
            });
        });
    }

    fileReplaceAction( $0, $1, ar ){
        let info = this.info;
        let p = this;

        let fullpath = path.join( info.currentRoot, $1 );
        let filepath =  fullpath.replace( info.projectRoot, '' ).replace( this.fixRe, '' );
        if( this.extensionRe.test( $1 )
            && info.feuid.dir.test( filepath )
        ){
            ar.push( fullpath );
            p.allFile.push( fullpath );
        }
    }




}
