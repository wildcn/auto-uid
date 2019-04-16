
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
    }

    init() {
        console.log( this.app.projectInfo );
        this.getChangeFiles();
    }

}
