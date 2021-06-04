#! /usr/bin/env node
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("./utils/debug"),
    logSuc = _require.logSuc,
    logErr = _require.logErr,
    logWar = _require.logWar,
    logInfo = _require.logInfo;

var fs = require("fs");
var os = require("os");
var path = require("path");
var shell = require("shelljs");
var merge = require("deepmerge");

var APP_ROOT = path.resolve(__dirname, "..");
var PROJECT_ROOT = process.env.PWD || process.cwd();

var packJSON = require(APP_ROOT + "/package.json");
var config = require(APP_ROOT + "/auto-uid.config.js");
var compareVersions = require("compare-versions");

var ProjectReplaceVUE = require("./ProjectReplaceVUE.js");

var Program = require("commander");

Program.version(packJSON.version).option("-a, --auto", "使用 -s 初始化项目配置，并执行 -f 全量匹配并添加唯一ID").option("-s, --setup", "初始化项目配置，在根目录下生成auto-uid.config.json").option("-f, --full", "处理所有匹配的文件").option("-t, --target <target>", "处理指定文件").option("-r, --dir <dir>", "处理指定目录下的文件,多目录以,分隔").option("-u, --update", "更新已经生成的唯一ID").option("-n, --byname", "优先使用class或者id生成uuid").option("-W, --write", "向dom中写入uid").option("-m, --dom", "使用dom结构替换uuid生成uid").option("-p, --path <path>", "自定义项目路径，默认为当前路径").option("-debug, --debug", "开启debug模式").option("-c, --clean", "清除已有的ID");

Program.parse(process.argv);
logInfo('version :', packJSON.version);

var Run = function () {
  function Run() {
    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Run);

    this.autoCommnad = typeof program.Command !== "undefined";
    this.program = program;
    if (program.auto) {
      program.setup = true;
      program.full = true;
      program.write = true;
    }
    if (!program.debug) {
      logSuc = logInfo = function logInfo(i) {
        return i;
      };
    }

    this.PROJECT_ROOT = program.path || PROJECT_ROOT;

    var projectInfo = this.resolveProjectInfo(this.PROJECT_ROOT);
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
    var project = void 0;

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

  (0, _createClass3.default)(Run, [{
    key: "resolveMain",
    value: function resolveMain(r) {
      r.appMain = path.join(r.APP_ROOT, "bin/main.js");
      r.projectMain = path.join(r.projectRoot, "node_modules/auto-uid/bin/main.js");
      r.projectPack = path.join(r.projectRoot, "node_modules/auto-uid/package.json");
      r.hasProjectMain = false;

      if (fs.existsSync(r.projectPack)) {
        var pPack = require(r.projectPack);
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
        r.projectMainCmd = "node \"" + r.projectMain + "\" ";
      }
    }
  }, {
    key: "setupConfig",
    value: function setupConfig(r) {
      if (!this.program.setup) return;
      var projectConfig = r.projectRoot + "/auto-uid.config.js";
      var modConfig = r.projectRoot + "/node_modules/auto-uid/auto-uid.config.js";
      var appConfig = r.APP_ROOT + "/auto-uid.config.js";

      if (!fs.existsSync(projectConfig)) {
        var target = fs.existsSync(modConfig) ? modConfig : "";
        if (!target) {
          target = fs.existsSync(appConfig) ? appConfig : "";
        }
        if (target) {
          fs.copyFileSync(target, projectConfig);
        }
      }
    }
  }, {
    key: "setupPackage",
    value: function setupPackage(r) {
      if (!this.program.setup) return;

      if (!r.package) {
        logErr("package.json not exists");
        return;
      }

      var pack = require(r.package);
      var install = [];

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
  }, {
    key: "installPack",
    value: function installPack(install, r) {
      var cmd = "";
      if (shell.which("yarn")) {
        cmd = "yarn add " + install.join(" ") + " --dev";
      } else if (shell.which("npm")) {
        cmd = "npm install -D " + install.join(" ");
      }

      if (cmd) {
        logInfo(cmd);
        shell.exec("cd \"" + r.projectRoot + "\" && " + cmd);
      } else {
        logErr("npm and yarn not exists");
      }
    }
  }, {
    key: "resolveProjectInfo",
    value: function resolveProjectInfo(proot) {
      var r = {};
      r.projectRoot = proot;
      r.currentRoot = proot;
      r.APP_ROOT = APP_ROOT;
      r.package = "";

      var tmpPath = proot;
      while (true) {
        var tmpFile = path.join(tmpPath, "package.json");

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
        var _tmpFile = path.join(tmpPath, ".git");

        if (fs.existsSync(_tmpFile)) {
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
  }, {
    key: "resolveConfig",
    value: function resolveConfig(r) {
      r.autoUid = merge.all([{}, fs.existsSync(r.APP_ROOT + "/auto-uid.config.js") ? require(r.APP_ROOT + "/auto-uid.config.js") : {}, fs.existsSync(r.projectRoot + "/auto-uid.config.js") ? require(r.projectRoot + "/auto-uid.config.js") : {}, fs.existsSync(r.currentRoot + "/auto-uid.config.js") ? require(r.currentRoot + "/auto-uid.config.js") : {}], { arrayMerge: function arrayMerge(destinationArray, sourceArray, options) {
          return sourceArray;
        } });
    }
  }]);
  return Run;
}();

// 如果是命令行模式，直接执行，否则等待调用


if (process.argv.some(function (arg) {
  return (/(auto-uid$|auto-uid\/src\/main|auto-uid\/bin\/main)/.test(arg)
  );
})) {
  new Run(Program);
}
module.exports = Run;