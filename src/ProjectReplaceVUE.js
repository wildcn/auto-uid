
import fs from "fs-extra";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

const shell = require( 'shelljs' );
const glob = require("glob");

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;


import Project from './Project.js';

export default class ProjectReplaceVUE extends Project {
    constructor( app ){
        super( app );

        this.delimiter = '|||||';
        this.pattern = '{delimiter}{count}{delimiter}{content}{delimiter}';
    }

    init() {
        console.log( this.app.projectInfo );

        this.getChangeFiles();

        this.process();
        //console.log( 'this.allFile:', this.allFile );
    }

    process(){
        let p = this;

        this.allFile.map( ( filepath, index ) => {
            if( index ) return ;

            this.tag = {};
            this.template = [];
            this.curCount = 0;
            this.curFilepath = filepath;

            this.curContent = fs.readFileSync( filepath, { encoding: this.info.feuid.encoding || 'utf8' } );

            this.getTemplate();
            this.getRoot();
        });
    }

    getTemplate(){
        //console.log( this.content );
        let curIndex = 0;
        while( true ){
            let tmpContent = this.curContent.slice( curIndex );
            let startReg = /<div[^<\/]*?>/i;
            let tmp = tmpContent.match( startReg  );

            if( !tmp ){
                break;
            }

            console.log( this.curFilepath );
            console.log( curIndex, tmp.index );
            //console.log( tmpContent );

            let nextIndex = curIndex + tmp.index + 1;

            let endIndex = this.matchEnd( nextIndex, startReg );

            //console.log( 'endIndex:', endIndex );

            console.log( this.curContent.slice( curIndex + tmp.index, endIndex ) );

            curIndex = nextIndex;
        }
    }

    matchEnd( nextIndex, startReg ){
        let r = 0;

        let endContent = this.curContent.slice( nextIndex );
        let tmpEnd = endContent.match( /<\/div>/i  );

        if( tmpEnd ){
            let endMatch = this.curContent.slice( nextIndex, nextIndex + tmpEnd.index + 6 ) 
            //console.log( endMatch );
            if( endMatch.match( startReg  ) ){
                r = this.matchEnd( nextIndex + tmpEnd.index + 6, startReg );
            }else{
                r = nextIndex + tmpEnd.index + 6;
            }
        }

        return r;
    }

    getRoot(){
    }

}
