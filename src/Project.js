

import fs from "fs";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

import shell from 'shelljs';

const glob = require( 'glob' );

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
        this.allRelativeFile = [];

        this.info.feuid2.dir.map( ( item, index ) => {
            this.info.feuid2.dir[index] = item.replace( /[\/]+$/, '' );
        });
        this.dirRe = new RegExp( `^(${this.info.feuid2.dir.join('|')})\/`, 'i');

        this.newRe = /new[\s]+file:[\s]+(.*)/;
        this.modifiedRe = /modified:[\s]+(.*)/;
        this.fixRe = /^(\/|\\)/;
        this.extensionRe = new RegExp( `\\.(vue)$`, 'i' );

        this.init();
    }

    init() {
    }

    initMethod() {
        //console.log( 'initMethod', Date.now() );
    }

    getChangeFiles(){
        let p = this;

        if( this.app.program.full ){
            p.info.feuid2.dir.map( ( item ) => {
                let globRe = `${p.info.projectRoot}/${item}/**/*.+(${p.info.feuid2.extension.join('|')})`;
                p.allFile = p.allFile.concat( glob.sync( globRe, {} ) );
                p.allRelativeFile = p.allFile.concat( glob.sync( globRe, {} ) );
            });
            return;
        }

        if (this.app.program.dir) {
          this.app.program.dir.split(',').map( ( item ) => {
            let globRe = `${p.info.projectRoot}/${item}/**/*.+(${p.info.feuid2.extension.join('|')})`;
            p.allFile = p.allFile.concat( glob.sync( globRe, {} ) );
            p.allRelativeFile = p.allFile.concat( glob.sync( globRe, {} ) );
        });
        }

        if( this.app.program.target ){
            console.log( this.app.program.target );
            p.allFile.push( path.resolve( this.app.program.target ) );
            p.allRelativeFile.push(this.app.program.target)
            return;
        }

        let gitStatus, lines;
        gitStatus = shell.exec( `cd '${this.info.currentRoot}' && git status`, { silent: true } );
        lines = gitStatus.stdout.split( '\n' );

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
            && p.dirRe.test( filepath )
        ){
            ar.push( fullpath );
            p.allFile.push( fullpath );
        }
    }




}
