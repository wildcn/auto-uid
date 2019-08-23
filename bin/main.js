#! /usr/bin/env node
'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var fs = require('fs');
var os = require('os');
var path = require('path');
var shell = require('shelljs');
var merge = require('deepmerge');

var APP_ROOT = path.resolve(__dirname, '..');
var PROJECT_ROOT = process.env.PWD || process.cwd();

var packJSON = require(APP_ROOT + '/package.json');
var config = require(APP_ROOT + '/config.json');
var compareVersions = require('compare-versions');

var program = require('commander');

program.version(packJSON.version).option('-a, --auto', '使用 -s 初始化项目配置，并执行 -f 全量匹配并添加唯一ID').option('-s, --setup', '初始化项目配置，在根目录下生成feuid.js、package.json添加pre-commit勾子').option('-f, --full', '处理所有匹配的文件').option('-t, --target <target>', '处理指定文件').option('-u, --update', '更新已经生成的唯一ID').option('-p, --path <path>', '自定义项目路径，默认为当前路径');
program.parse(process.argv);

if (program.auto) {
    program.setup = true;
    program.full = true;
}

PROJECT_ROOT = program.path || PROJECT_ROOT;

var projectInfo = resolveProjectInfo(PROJECT_ROOT);
resolveConfig(projectInfo);
setupPackage(projectInfo);
setupConfig(projectInfo);

PROJECT_ROOT = projectInfo.projectRoot;

resolveMain(projectInfo);

require('babel-core/register');
require("babel-polyfill");
var init = require('./app').init;

if (program.auto) {
    if (projectInfo.hasProjectMain && projectInfo.projectMainCmd) {
        shell.exec(projectInfo.projectMainCmd + '--full');
    } else {
        init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);
    }
} else if (!program.setup) {
    if (projectInfo.hasProjectMain && projectInfo.projectMainCmd) {
        if (program.full) {
            shell.exec(projectInfo.projectMainCmd + '--full');
        } else if (program.target) {
            shell.exec(projectInfo.projectMainCmd + '--target');
        } else {
            shell.exec(projectInfo.projectMainCmd);
        }
    } else {
        init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);
    }
}

function resolveMain(r) {
    r.appMain = path.join(r.appRoot, 'bin/main.js');
    r.projectMain = path.join(r.projectRoot, 'node_modules/feuid/bin/main.js');
    r.projectPack = path.join(r.projectRoot, 'node_modules/feuid/package.json');
    r.hasProjectMain = false;

    if (fs.existsSync(r.projectPack)) {
        var pPack = require(r.projectPack);
        if (packJSON.version && pPack.version) {
            if (compareVersions(packJSON.version, pPack.version) > -1) {
                return;
            }
        }
    }

    if (!shell.which('node')) {
        return;
    }

    if (r.appMain == r.projectMain) {
        return;
    }

    if (fs.existsSync(r.projectMain)) {
        r.hasProjectMain = 1;
        r.projectMainCmd = 'node "' + r.projectMain + '" ';
    }
}

function setupConfig(r) {
    if (!program.setup) return;
    var projectConfig = r.projectRoot + '/feuid.config.js';
    var modConfig = r.projectRoot + '/node_modules/feuid/feuid.config.js';
    var appConfig = r.appRoot + '/feuid.config.js';

    if (!fs.existsSync(projectConfig)) {
        var target = fs.existsSync(modConfig) ? modConfig : '';
        if (!target) {
            target = fs.existsSync(appConfig) ? appConfig : '';
        }
        if (target) {
            fs.copyFileSync(target, projectConfig);
        }
    }
}

function setupPackage(r) {
    if (!program.setup) return;

    if (!r.package) {
        console.error('package.json not exists');
        return;
    }

    var pack = require(r.package);
    var install = [];

    if (!('feuid' in pack.dependencies || 'feuid' in pack.devDependencies)) {
        install.push('feuid');
    }
    if (!('pre-commit' in pack.dependencies || 'pre-commit' in pack.devDependencies)) {
        install.push('pre-commit');
    }

    if (install.length) {
        installPack(install, r);
        //shell.sleep( 5 );
        delete require.cache[require.resolve(r.package)];
        pack = require(r.package);
    }

    if (!pack.scripts) {
        pack.scripts = {};
    }

    var writePack = 0;

    if (!(pack.scripts && pack.scripts.feuid)) {
        pack.scripts.feuid = 'node ./node_modules/feuid/bin/main.js';
        writePack = 1;
    }

    if (!pack['pre-commit']) {
        pack['pre-commit'] = ['feuid'];
        writePack = 1;
    }
    if (!pack['pre-commit'].toString().indexOf('feuid') > -1) {
        if (typeof pack['pre-commit'] == 'string') {
            pack['pre-commit'] += ',feuid';
            writePack = 1;
        } else if (typeof pack['pre-comit'] == 'array') {
            pack['pre-commit'].push('feuid');
            writePack = 1;
        }
    }

    if (writePack) {
        fs.writeFileSync(r.package, JSON.stringify(pack, null, 2), { encoding: projectInfo.feuid.encoding || 'utf8' });
    }
}

function installPack(install, r) {
    var cmd = '';
    if (shell.which('yarn')) {
        cmd = 'yarn add ' + install.join(' ');
    } else if (shell.which('npm')) {
        cmd = 'npm install ' + install.join(' ');
    }

    if (cmd) {
        console.log();
        console.log(info(cmd));
        console.log();
        shell.exec('cd "' + r.projectRoot + '" && ' + cmd);
    } else {
        console.log(error('npm and yarn not exists'));
    }
}

function resolveProjectInfo(proot) {
    var r = {};
    r.projectRoot = proot;
    r.currentRoot = proot;
    r.appRoot = APP_ROOT;
    r.package = '';

    var tmpPath = proot;
    while (true) {
        var tmpFile = path.join(tmpPath, 'package.json');

        if (fs.existsSync(tmpFile)) {
            r.package = tmpFile;
            r.projectRoot = tmpPath;
            break;
        } else {
            if (tmpPath.length === 1) {
                break;
            }
            tmpPath = path.join(tmpPath, '../');
        }
    }

    return r;
}

function resolveConfig(r) {
    r.feuid = merge.all([{}, fs.existsSync(r.appRoot + '/feuid.config.js') ? require(r.appRoot + '/feuid.config.js') : {}, fs.existsSync(r.projectRoot + '/feuid.config.js') ? require(r.projectRoot + '/feuid.config.js') : {}, fs.existsSync(r.currentRoot + '/feuid.config.js') ? require(r.currentRoot + '/feuid.config.js') : {}], { arrayMerge: function arrayMerge(destinationArray, sourceArray, options) {
            return sourceArray;
        } });
}