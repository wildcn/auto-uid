
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

            let tagInfo = this.getTag( 'template', filepath, 0 );

            tagInfo.data.reverse().map( item => {
                console.log( item );
                let content = this.addDataId( item.innerTag.tagContent );

                console.log( content );
            });

            this.getRoot();
        });
    }

    addDataId( content ){
        content = content.replace( /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi, function( $0, $1, $2 ){
            let uid = '';
            if( !/data-testid\=/i.test( $2 ) ){
                uid = ` data-testid="test" `
            }
            let r = `${$1}${uid}${$2}`;
            return r;
        });

        return content;
    }

    getTag( tag, filepath, matchAll = false ){
        let curIndex = 0;
        let result = { content: this.curContent, data: [], filepath: filepath };
        while( true ){
            let tmpContent = this.curContent.slice( curIndex );
            let startReg = new RegExp( `<${tag}[^<\\/]*?>`, 'i' );
            let tmp = tmpContent.match( startReg  );

            if( !tmp ){
                break;
            }

            console.log( this.curFilepath );

            let nextIndex = curIndex + tmp.index + 1;

            let endResult = this.matchEnd( nextIndex, startReg, new RegExp( `<\\/${tag}>`, 'i' ), tag.length + 3 );
            let endIndex = endResult.end;

            /*
            console.log( curIndex + tmp.index, endIndex );
            console.log( this.curContent.slice( curIndex + tmp.index, endIndex ) );
            */

            if( endIndex ){
                let data = {
                    fullTag: {
                        start: curIndex + tmp.index
                        , end: endIndex
                        , tagContent: this.curContent.slice( curIndex + tmp.index, endIndex )
                    }
                    , innerTag: {
                        start: curIndex + tmp.index + tmp[0].length
                        , end: endResult.start
                    }
                };
                data.innerTag.tagContent = this.curContent.slice( data.innerTag.start, data.innerTag.end );
                result.data.push( data );
            }

            curIndex = nextIndex;
            if( !matchAll ){
                break;
            }
        }
        return result;
    }

    matchEnd( nextIndex, startReg, endReg, tagLength ){
        let r = { start: 0, end: 0};

        let endContent = this.curContent.slice( nextIndex );
        let tmpEnd = endContent.match( endReg  );

        if( tmpEnd ){
            let endMatch = this.curContent.slice( nextIndex, nextIndex + tmpEnd.index + tmpEnd[0].length ) 
            let tmpMatch = endMatch.match( startReg );
            if( tmpMatch ){
                r = this.matchEnd( nextIndex + tmpEnd.index + tagLength, startReg, endReg, tmpEnd[0].length );
            }else{
                r.start = nextIndex + tmpEnd.index;
                r.end = nextIndex + tmpEnd.index + tmpEnd[0].length;
            }
        }

        return r;
    }

    getRoot(){
    }

}
