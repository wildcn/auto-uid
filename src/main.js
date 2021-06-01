#! /usr/bin/env node

import chalk from "chalk";
const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const success = chalk.greenBright;
const info = chalk.bold.blue;

const fs = require("fs");
const os = require("os");
const path = require("path");
const shell = require("shelljs");
const merge = require("deepmerge");

const APP_ROOT = path.resolve(__dirname, "..");
let PROJECT_ROOT = process.env.PWD || process.cwd();

let GIT_DIR = PROJECT_ROOT;

const packJSON = require(`${APP_ROOT}/package.json`);
const config = require(`${APP_ROOT}/auto-uid.config.js`);
const compareVersions = require("compare-versions");

var program = require("commander");

program
  .version(packJSON.version)
  .option(
    "-a, --auto",
    "使用 -s 初始化项目配置，并执行 -f 全量匹配并添加唯一ID"
  )
  .option(
    "-s, --setup",
    "初始化项目配置，在根目录下生成auto-uid.config.json"
  )
  .option("-f, --full", "处理所有匹配的文件")
  .option("-t, --target <target>", "处理指定文件")
  .option("-r, --dir <dir>", "处理指定目录下的文件,多目录以,分隔")
  .option("-u, --update", "更新已经生成的唯一ID")
  .option("-W, --write", "向dom中写入uid")
  .option("-m, --dom", "使用dom结构替换uuid生成uid")
  .option("-p, --path <path>", "自定义项目路径，默认为当前路径")
  .option("-c, --clean", "清除已有的ID");

program.parse(process.argv);


if (program.auto) {
  program.setup = true;
  program.full = true;
  program.write = true;
}

PROJECT_ROOT = program.path || PROJECT_ROOT;

let projectInfo = resolveProjectInfo(PROJECT_ROOT);
resolveConfig(projectInfo);
setupPackage(projectInfo);
setupConfig(projectInfo);

PROJECT_ROOT = projectInfo.projectRoot;
GIT_DIR = projectInfo.gitRoot;

resolveMain(projectInfo);

require("babel-core/register");
if (!global._babelPolyfill) {
  require("babel-polyfill");
}
const init = require("./app").init;

if (program.auto) {
  if (projectInfo.hasProjectMain && projectInfo.projectMainCmd) {
    shell.exec(projectInfo.projectMainCmd + "--full");
  } else {
    init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);
  }
} else if (!program.setup) {
  if (projectInfo.hasProjectMain && projectInfo.projectMainCmd) {
    if (program.full) {
      shell.exec(projectInfo.projectMainCmd + "--full");
    } else if (program.dir) {
      shell.exec(projectInfo.projectMainCmd + "--dir");
    } else if (program.target) {
      shell.exec(projectInfo.projectMainCmd + "--target");
    } else {
      shell.exec(projectInfo.projectMainCmd);
    }
  } else {
    init(APP_ROOT, PROJECT_ROOT, packJSON, config, program, projectInfo);
  }
}


function resolveMain(r) {
  r.appMain = path.join(r.appRoot, "bin/main.js");
  r.projectMain = path.join(r.projectRoot, "node_modules/auto-uid/bin/main.js");
  r.projectPack = path.join(r.projectRoot, "node_modules/auto-uid/package.json");
  r.hasProjectMain = false;

  if (fs.existsSync(r.projectPack)) {
    let pPack = require(r.projectPack);
    if (packJSON.version && pPack.version) {
      if (compareVersions(packJSON.version, pPack.version) > -1) {
        return;
      }
    }
  }

  if (!shell.which("node")) {
    return;
  }

  if (r.appMain == r.projectMain) {
    return;
  }

  if (fs.existsSync(r.projectMain)) {
    r.hasProjectMain = 1;
    r.projectMainCmd = `node "${r.projectMain}" `;
  }
}

function setupConfig(r) {
  if (!program.setup) return;
  let projectConfig = `${r.projectRoot}/auto-uid.config.js`;
  let modConfig = `${r.projectRoot}/node_modules/auto-uid/auto-uid.config.js`;
  let appConfig = `${r.appRoot}/auto-uid.config.js`;

  if (!fs.existsSync(projectConfig)) {
    let target = fs.existsSync(modConfig) ? modConfig : "";
    if (!target) {
      target = fs.existsSync(appConfig) ? appConfig : "";
    }
    if (target) {
      fs.copyFileSync(target, projectConfig);
    }
  }
}

function setupPackage(r) {
  if (!program.setup) return;

  if (!r.package) {
    console.error("package.json not exists");
    return;
  }

  let pack = require(r.package);
  let install = [];


  if (install.length) {
    installPack(install, r);
    //shell.sleep( 5 );
    delete require.cache[require.resolve(r.package)];
    pack = require(r.package);
  }

  if (!pack.scripts) {
    pack.scripts = {};
  }
}

function installPack(install, r) {
  let cmd = "";
  if (shell.which("yarn")) {
    cmd = `yarn add ${install.join(" ")} --dev`;
  } else if (shell.which("npm")) {
    cmd = `npm install -D ${install.join(" ")}`;
  }

  if (cmd) {
    console.log();
    console.log(info(cmd));
    console.log();
    shell.exec(`cd "${r.projectRoot}" && ${cmd}`);
  } else {
    console.log(error("npm and yarn not exists"));
  }
}

function resolveProjectInfo(proot) {
  let r = {};
  r.projectRoot = proot;
  r.currentRoot = proot;
  r.appRoot = APP_ROOT;
  r.package = "";

  let tmpPath = proot;
  while (true) {
    let tmpFile = path.join(tmpPath, "package.json");

    if (fs.existsSync(tmpFile)) {
      r.package = tmpFile;
      r.projectRoot = tmpPath;
      break;
    } else {
      if (tmpPath.length === 1) {
        break;
      }
      tmpPath = path.join(tmpPath, "../");
    }
  }

  tmpPath = proot;
  while (true) {
    let tmpFile = path.join(tmpPath, ".git");

    if (fs.existsSync(tmpFile)) {
      r.gitRoot = tmpPath;
      break;
    } else {
      if (tmpPath.length === 1) {
        break;
      }
      tmpPath = path.join(tmpPath, "../");
    }
  }

  return r;
}

function resolveConfig(r) {
  r.autoUid = merge.all(
    [
      {},
      fs.existsSync(`${r.appRoot}/auto-uid.config.js`)
        ? require(`${r.appRoot}/auto-uid.config.js`)
        : {},
      fs.existsSync(`${r.projectRoot}/auto-uid.config.js`)
        ? require(`${r.projectRoot}/auto-uid.config.js`)
        : {},
      fs.existsSync(`${r.currentRoot}/auto-uid.config.js`)
        ? require(`${r.currentRoot}/auto-uid.config.js`)
        : {}
    ],
    { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
  );
}
