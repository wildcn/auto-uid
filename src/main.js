#! /usr/bin/env node

let { logSuc, logErr, logWar, logInfo } = require("./utils/debug");

const fs = require("fs");
const os = require("os");
const path = require("path");
const shell = require("shelljs");
const merge = require("deepmerge");

const APP_ROOT = path.resolve(__dirname, "..");
let PROJECT_ROOT = process.env.PWD || process.cwd();

const packJSON = require(`${APP_ROOT}/package.json`);
const config = require(`${APP_ROOT}/auto-uid.config.js`);
const compareVersions = require("compare-versions");

const ProjectReplaceVUE = require("./ProjectReplaceVUE.js");

var Program = require("commander");

Program.version(packJSON.version)
  .option(
    "-a, --auto",
    "使用 -s 初始化项目配置，并执行 -f 全量匹配并添加唯一ID"
  )
  .option("-s, --setup", "初始化项目配置，在根目录下生成auto-uid.config.json")
  .option("-f, --full", "处理所有匹配的文件")
  .option("-t, --target <target>", "处理指定文件")
  .option("-r, --dir <dir>", "处理指定目录下的文件,多目录以,分隔")
  .option("-u, --update", "更新已经生成的唯一ID")
  .option("-n, --byname", "优先使用class或者id生成uuid")
  .option("-W, --write", "向dom中写入uid")
  .option("-m, --dom", "使用dom结构替换uuid生成uid")
  .option("-p, --path <path>", "自定义项目路径，默认为当前路径")
  .option("-debug, --debug", "开启debug模式")
  .option("-c, --clean", "清除已有的ID");

Program.parse(process.argv);
logInfo('version :',packJSON.version);
class Run {
  constructor(program = {}) {
    this.autoCommnad = typeof program.Command !== "undefined";
    this.program = program;
    if (program.auto) {
      program.setup = true;
      program.full = true;
      program.write = true;
    }
    if (!program.debug) {
      logSuc = logInfo = i => i;
    }

    this.PROJECT_ROOT = program.path || PROJECT_ROOT;

    let projectInfo = this.resolveProjectInfo(this.PROJECT_ROOT);
    this.resolveConfig(projectInfo);
    this.setupPackage(projectInfo);
    this.setupConfig(projectInfo);
    this.resolveMain(projectInfo);

    // 初始化配置
    this.PROJECT_ROOT = projectInfo.projectRoot;
    this.packJSON = packJSON;
    this.config = config;
    this.APP_ROOT = APP_ROOT;
    this.projectInfo = projectInfo;

    require("babel-core/register");
    if (!global._babelPolyfill) {
      require("babel-polyfill");
    }
    let project;

    if (program.auto) {
      if (projectInfo.hasProjectMain && projectInfo.projectMainCmd) {
        shell.exec(projectInfo.projectMainCmd + "--full");
      } else {
        project = new ProjectReplaceVUE(this);
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
        project = new ProjectReplaceVUE(this);
      }
    }
    this.project = project;
  }
  resolveMain(r) {
    r.appMain = path.join(r.APP_ROOT, "bin/main.js");
    r.projectMain = path.join(
      r.projectRoot,
      "node_modules/auto-uid/bin/main.js"
    );
    r.projectPack = path.join(
      r.projectRoot,
      "node_modules/auto-uid/package.json"
    );
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

  setupConfig(r) {
    if (!this.program.setup) return;
    let projectConfig = `${r.projectRoot}/auto-uid.config.js`;
    let modConfig = `${r.projectRoot}/node_modules/auto-uid/auto-uid.config.js`;
    let appConfig = `${r.APP_ROOT}/auto-uid.config.js`;

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

  setupPackage(r) {
    if (!this.program.setup) return;

    if (!r.package) {
      logErr("package.json not exists");
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

  installPack(install, r) {
    let cmd = "";
    if (shell.which("yarn")) {
      cmd = `yarn add ${install.join(" ")} --dev`;
    } else if (shell.which("npm")) {
      cmd = `npm install -D ${install.join(" ")}`;
    }

    if (cmd) {
      logInfo(cmd);
      shell.exec(`cd "${r.projectRoot}" && ${cmd}`);
    } else {
      logErr(`npm and yarn not exists`);
    }
  }

  resolveProjectInfo(proot) {
    let r = {};
    r.projectRoot = proot;
    r.currentRoot = proot;
    r.APP_ROOT = APP_ROOT;
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

  resolveConfig(r) {
    r.autoUid = merge.all(
      [
        {},
        fs.existsSync(`${r.APP_ROOT}/auto-uid.config.js`)
          ? require(`${r.APP_ROOT}/auto-uid.config.js`)
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
}

// 如果是命令行模式，直接执行，否则等待调用
if (
  process.argv.some(arg =>
    /(auto-uid$|auto-uid\/src\/main|auto-uid\/bin\/main)/.test(arg)
  )
) {
  new Run(Program);
}
module.exports = Run;
