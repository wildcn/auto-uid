

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

        this.init();

    }

    init() {
    }

    initMethod() {
        console.log( 'initMethod', Date.now() );
    }

    getChangeFiles(){

        let gitStatus = shell.exec( `cd '${info.currentRoot}' && git status`, { silent: true } );
        let lines = gitStatus.stdout.split( '\n' );
        let p = this;

        lines.map( ( item, index ) => {
            item = item.trim();
            item.replace( this.newRe, function( $0, $1 ){
                fileReplaceAction( $0, $1, p.newFile ){
            });
            item.replace( this.modifiedRe, function( $0, $1 ){
                fileReplaceAction( $0, $1, p.modifiedFile ){
            });
        });
    }

    fileReplaceAction( $0, $1, ar ){
        let info = this.info;

        let fullpath = path.join( info.currentRoot, $1 );
        let filepath =  fullpath.replace( info.projectRoot, '' ).replace( this.fixRe, '' );
        if( info.feuid.extension.test( $1 )
            && info.feuid.dir.test( filepath )
        ){
            //console.log( 'find new modified:', $1 );
            ar.push( fullpath );
            p.allFile.push( fullpath );
        }
    }




}
