
import fs from "fs-extra";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

const shell = require( 'shelljs' );
const glob = require("glob");
const Uuid = require( 'uuid-lib' );

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.greenBright;
const info = chalk.bold.blue;

import Project from './Project.js';

export default class ProjectReplaceVUE extends Project {
    constructor( app ){
        super( app );
    }

    init() {
        console.log( this.info );
        this.delimiter = '|||||';
        this.pattern = '{delimiter}{count}{delimiter}{content}{delimiter}';
        //this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi;
        this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?)(\/>|>)/gi;

        this.attrnameRe = new RegExp( `${this.info.feuid.attrname}[\\s]*?\\=`, 'i');
        this.fixEmptyRe = new RegExp( `(${this.info.feuid.attrname}[\\s]*?\\=)('|")([\\s]*)?\\2`, 'ig');
        this.fixRepeatRe = new RegExp( `(${this.info.feuid.attrname}[\\s]*?\\=)('|")([^'"]*)?\\2`, 'ig');
        this.firstSpaceRe = /^([\s]|>)/;
        this.lastSpaceRe = /[\s]$/;

        this.getChangeFiles();
        this.process();
    }

    process(){
        let p = this;

        this.allFile.map( ( filepath, index ) => {
            this.tag = {};
            this.template = [];
            this.curCount = 0;
            this.curFilepath = filepath;

            this.curContent = fs.readFileSync( filepath, { encoding: this.info.feuid.encoding || 'utf8' } );

            //let tagInfo = this.getTag( 'div', filepath, 1 );
            this.tagInfo = this.getTag( 'template', filepath, 0 );

            this.tagInfo.data.map( item => {
                //console.log( item );
                let content = this.addDataId( item.innerTag.tagContent );
                
                this.tagInfo.newContent =  [
                    this.tagInfo.newContent.slice( 0, item.innerTag.start )
                    , content
                    , this.tagInfo.newContent.slice( item.innerTag.end )
                ].join('');
            });

            if( this.tagInfo.content != this.tagInfo.newContent ){
                fs.writeFileSync( filepath, this.tagInfo.newContent, { encoding: this.info.feuid.encoding || 'utf8' } )
                shell.exec( `cd '${this.info.projectRoot}' && git add ${filepath}`, { silent: true } )
            }

        });
    }

    addDataId( content ){
        let info = this.info;
        let p = this;

        if( info.feuid.fixempty ){
            content = this.fixEmpty( content );
        }
        if( info.feuid.fixrepeat){
            content = this.fixRepeat( content );
        }
        content = content.replace( p.tagContentRe, function( $0, $1, $2, $3 ){
            let uid = '';
            //if( !/data-testid\=/i.test( $2 ) ){
            if( !p.attrnameRe.test( $2 ) ){
                uid = `${info.feuid.attrname}="${info.feuid.idprefix}${Uuid.create()}"`
                if( !p.lastSpaceRe.test( $2 ) ){
                    uid = ' ' + uid;
                }
                /*
                if( !p.firstSpaceRe.test( $2 ) ){
                    uid += ' ';
                }
                */
            }
            let r = `${$1}${$2}${uid}${$3}`;
            return r;
        });

        return content;
    }

    fixRepeat( content ){

        let count = 0;
        let uuidObj = {};
        let repeatObj = {};
        content.replace( this.fixRepeatRe, function( $0, $1, $2, $3 ){
            uuidObj[ $3 ] = uuidObj[ $3 ] || 0;
            if( uuidObj[ $3 ] ){
                repeatObj[ $3 ] = uuidObj[ $3 ] + 1;
            }
            uuidObj[ $3 ]++;
        });

        for( let key in repeatObj ){
            let fixRe = new RegExp( `(${this.info.feuid.attrname}[\\s]*?\\=)('|")(${key})?\\2`, 'ig');
            count = 0; 
            content = content.replace( fixRe, function($0, $1, $2, $3){
                if( count ){
                    $3 = this.info.feuid.idprefix + Uuid.create();
                }
                count++;
                return `${$1}${$2}${$3}${$2}`;
            });
        }

        return content;
    }


    fixEmpty( content ){

        content = content.replace( this.fixEmptyRe, function( $0, $1, $2, $3 ){
            return `${$1}${$2}${this.info.feuid.idprefix}${Uuid.create()}${$2}`;
        });

        return content;
    }

    getTag( tag, filepath, matchAll = false ){
        let curIndex = 0;
        let result = { 
            content: this.curContent
            , newContent: this.curContent
            , data: []
            , filepath: filepath 
        };

        let startReg = new RegExp( `<${tag}[^<\\/]*?>`, 'i' );
        let endRe = new RegExp( `<\\/${tag}>`, 'i' );

        while( true ){
            let tmpContent = this.curContent.slice( curIndex );
            let tmp = tmpContent.match( startReg  );

            if( !tmp ){
                break;
            }

            console.log( this.curFilepath );

            let nextIndex = curIndex + tmp.index + 1;

            let endResult = this.matchEnd( nextIndex, startReg, endRe, tag.length + 3 );
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
                result.data.unshift( data );
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

}
