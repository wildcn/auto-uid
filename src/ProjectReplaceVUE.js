
import fs from "fs-extra";
import path from "path";

import chalk from 'chalk';
import clear from 'clear';

const shell = require( 'shelljs' );
const glob = require("glob");
const Uuid = require( 'uuid/v4' );

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
        this.gcount = 1;
        this.idmap = {};

        //console.log( this.info );
        this.delimiter = '|||||';
        this.pattern = '{delimiter}{count}{delimiter}{content}{delimiter}';
        //this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi;
        this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?)(\/>|>)/gi;

        this.attrnameRe = new RegExp( `${this.info.feuid.attrname}[\\s]*?\\=`, 'i');
        this.fixEmptyRe = new RegExp( `(${this.info.feuid.attrname}[\\s]*?\\=)('|")([\\s]*)?\\2`, 'ig');
        this.fixRepeatRe = new RegExp( `(${this.info.feuid.attrname}[\\s]*?\\=)('|")([a-z0-9\\-\\_]*)?\\2`, 'ig');
        this.firstSpaceRe = /^([\s]|>)/;
        this.lastSpaceRe = /[\s]$/;
        this.equalContentRe = /(\=[\s]*?)('|")([^\2]*?)\2/g;

        if( this.info.feuid.ignoretag && this.info.feuid.ignoretag.length ){
            this.ignoreTagRe = new RegExp( `^<(${this.info.feuid.ignoretag.join('|')})\\b`, 'i');
        }

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
                console.log( success( 'feuid update file:' ), success( filepath ) );
                fs.writeFileSync( filepath, this.tagInfo.newContent, { encoding: this.info.feuid.encoding || 'utf8' } )
                shell.exec( `cd '${this.info.projectRoot}' && git add ${filepath}`, { silent: true } )
            }

        });
    }

    addDataId( content ){
        let info = this.info;
        let p = this;

        let attrPlaceholder = '66FEUID';
        let attrData = {};
        let attrCount = 1;

        if( p.app.program.update ){
            content = content.replace( this.fixRepeatRe, function( $0, $1, $2, $3 ){
                return `${$1}${$2}${info.feuid.idprefix}${p.getUuid()}${$2}`;
            });
        }

        content = content.replace( this.equalContentRe, function( $0, $1, $2, $3 ){
            let key = `${attrPlaceholder}${attrCount}${attrPlaceholder}`;
            attrData[ key ] = $3;
            attrCount++;
            return `${$1}${$2}${key}${$2}`;
        });

        if( info.feuid.fixempty ){
            content = this.fixEmpty( content );
        }
        if( info.feuid.fixrepeat){
            content = this.fixRepeat( content );
        }
        content = content.replace( p.tagContentRe, function( $0, $1, $2, $3 ){
            let uid = '';

            let r = `${$1}${$2}${uid}${$3}`;

            if( p.ignoreTagRe && p.ignoreTagRe.test( $1 ) ){
                return r;
            }

            if( !p.attrnameRe.test( $2 ) ){
                uid = `${info.feuid.attrname}="${info.feuid.idprefix}${p.getUuid()}"`
                if( !p.lastSpaceRe.test( $2 ) ){
                    uid = ' ' + uid;
                }
            }
            r = `${$1}${$2}${uid}${$3}`;

            return r;
        });
        //repeat list add count
        let countattrname = info.feuid.countattrname || 'data-feuidcount';
        let countReName = new RegExp( `(\\:${countattrname}.*?\\=)('|")(.*?)\\2` );

        content = content.replace( p.tagContentRe, function( $0, $1, $2, $3 ){
            let uid = '';

            let r = `${$1}${$2}${uid}${$3}`;

            if( p.ignoreTagRe && p.ignoreTagRe.test( $1 ) ){
                return r;
            }
            if(
                /\bv\-for\b/i.test( r )
                && new RegExp( `${info.feuid.attrname}\\b`, 'i').test( r )
                && new RegExp( `${countattrname}\\b`, 'i').test( r )
                && !/\:key\b/i.test( r )
            ){
                r = r.replace( countReName, `` );
                return r;
            }

            if(
                /\bv\-for\b/i.test( r )
                && /\:key\b/i.test( r )
                && new RegExp( `${info.feuid.attrname}\\b`, 'i').test( r )
             ){
                let curKey = '';

                r.replace( /.*?\:key.*?\=('|")(.*?)\1/, function( $0, $1, $2 ){
                    curKey = $2;
                });

                if( !new RegExp( `:${countattrname}\\b`, 'i' ).test( r  ) ){
                    uid = uid + ` :${countattrname}="${curKey}"`
                    r = `${$1}${$2}${uid}${$3}`;
                }else{
                    r = r.replace( countReName, `$1$2${curKey}$2` );
                }
            }

            return r;
        });

        for( let key in attrData ){
            content = content.replace( new RegExp( key, 'g' ), attrData[key] );
        }

        return content;
    }

    fixRepeat( content ){

        let count = 0;
        let uuidObj = {};
        let repeatObj = {};
        let p = this;
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
                    $3 = this.info.feuid.idprefix + p.getUuid();
                }
                count++;
                return `${$1}${$2}${$3}${$2}`;
            });
        }

        return content;
    }


    fixEmpty( content ){
        let p = this;

        content = content.replace( this.fixEmptyRe, function( $0, $1, $2, $3 ){
            return `${$1}${$2}${this.info.feuid.idprefix}${p.getUuid()}${$2}`;
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

            //console.log( this.curFilepath );

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

    getUuid(){
        let r = ( Date.now() + parseInt( Math.random() *  Math.pow( 10, 12 ) ) + this.gcount++ ).toString( 16 );
        //let r =  Uuid().replace( /\-/g, '' );
        if( r in this.idmap ){
            r = this.getUuid();
        }
        this.idmap[ r ] = this.gcount;
        return r;
    }

}
