const path = require("path");
const glob = require("glob");
const { logInfo } = require("./utils/debug");
module.exports = class Project {
  constructor(app) {
    this.app = app;
    this.info = this.app.projectInfo;
    this.changeFiles = [];
    this.info.autoUid.dir.map((item, index) => {
      this.info.autoUid.dir[index] = item.replace(/[\/]+$/, "");
    });
  }
  // 获取操作需要的文件列表
  getChangeFiles() {
    logInfo("getChangeFiles");
    let p = this;
    let program = this.program || this.app.program || {};
    if (program.full || program.clean) {
      p.info.autoUid.dir.map(item => {
        let globRe = `${
          p.info.projectRoot
        }/${item}/**/*.+(${p.info.autoUid.extension.join("|")})`;
        p.changeFiles = p.changeFiles.concat(glob.sync(globRe, {}));
      });
    }

    if (program.dir) {
      program.dir.split(",").map(item => {
        let globRe = `${
          p.info.projectRoot
        }/${item}/**/*.+(${p.info.autoUid.extension.join("|")})`;
        p.changeFiles = p.changeFiles.concat(glob.sync(globRe, {}));
      });
    }

    if (program.target) {
      console.log(program.target);
      p.changeFiles.push(path.resolve(program.target));
    }
    return p.changeFiles;
  }
};
