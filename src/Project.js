const path = require("path");
const glob = require("glob");
const { logInfo } = require("./utils/debug");
module.exports = class Project {
  constructor(app) {
    this.app = app;
    this.info = this.app.projectInfo;
    this.changeFiles = [];
    this.files = {};
    this.absFilesObj = {};
    this.info.autoUid.dir.map((item, index) => {
      this.info.autoUid.dir[index] = item.replace(/[\/]+$/, "");
    });
  }
  // 获取操作需要的文件列表
  getChangeFiles() {
    logInfo("getChangeFiles");
    let p = this;
    let program = this.program || this.app.program || {};
    let cwd = process.cwd();
    if (program.full || program.clean) {
    p.info.autoUid.dir.map(item => {
      let relativeGlobReg = `${item}/**/*.+(${p.info.autoUid.extension.join("|")})`;
      glob.sync(relativeGlobReg, {}).forEach(relativeFilePath=>{
        p.files[relativeFilePath] = path.resolve(cwd,relativeFilePath);
      });
      });
    }

    if (program.dir) {
      program.dir.split(",").map(item => {
        let relativeGlobReg = `${item}/**/*.+(${p.info.autoUid.extension.join("|")})`;
        glob.sync(relativeGlobReg, {}).forEach(relativeFilePath=>{
          p.files[relativeFilePath] = path.resolve(cwd,relativeFilePath);
        });
      });
    }

    if (program.target && fs.existsSync(path.resolve(cwd,program.target))) {
      p.files[program.target] = path.resolve(cwd,program.target);
    }
    logInfo(p.files)
    p.changeFiles = Object.values(p.files);
    p.absFilesObj = Object.entries(p.files).reduce((res,item)=>Object.assign(res,{[item[1]]:item[0]}),{})
    return p.changeFiles;
  }
};
