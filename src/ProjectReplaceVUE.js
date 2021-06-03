require("./utils/polyfile.js");
const fs = require("fs-extra");
const path = require("path");

const { logSuc, logErr, logInfo, logWar } = require("./utils/debug");

const ProcessFragment = require("./ProcessFragment");

const Project = require("./Project.js");

module.exports = class ProjectReplaceVUE extends Project {
  constructor(app) {
    super(app);
    this.app = app;
    this.tempErrorAttrs = {}; // 支持jsx的错误parse，和v-else等空attrs
    this.attrname = this.info.autoUid.attrname;
    this.distJson = {};
    this.distAddr = path.resolve(this.info.projectRoot, this.info.autoUid.dist);
    this.realChangeFiles = [];
    this.readDistJson();
    if (this.app.autoCommnad) {
      logInfo("auto Command model!");
      this.init();
    }
  }

  init() {
    this.getChangeFiles();
    // 自动处理
    this.process();
  }
  readDistJson() {
    logInfo("readDistJson");
    // 读取dist配置
    if (fs.existsSync(this.distAddr)) {
      let distFileContent = fs.readFileSync(this.distAddr, {
        encoding: "utf-8"
      });
      if (distFileContent) {
        try {
          this.distJson = JSON.parse(distFileContent);
        } catch (err) {
          logWar(err);
        }
      }
    }
    this.distJsonCache = JSON.stringify(this.distJson);
  }
  process() {
    logInfo("ProjectVue process");
    let p = this;
    if (this.changeFiles.length === 0) {
      this.getChangeFiles();
    }
    if (this.changeFiles.length === 0) {
      logErr(
        `no changeFiles read, please check auto-uid.config.js or new (options)`
      );
    }
    this.changeFiles.map((filepath, index) => {
      this.tag = {};
      this.template = [];
      this.curFilepath = filepath;
      this.curContent = fs.readFileSync(filepath, {
        encoding: this.info.autoUid.encoding || "utf-8"
      });

      this.tagInfo = this.getTag("template", filepath, 0);

      this.tagInfo.data.map(item => {
        let content = new ProcessFragment(this).process(
          item.innerTag.tagContent,
          filepath
        );

        this.tagInfo.newContent = [
          this.tagInfo.newContent.slice(0, item.innerTag.start),
          content,
          this.tagInfo.newContent.slice(item.innerTag.end)
        ].join("");
      });

      if (this.tagInfo.content != this.tagInfo.newContent) {
        logSuc(`update file,${filepath}`);
        fs.writeFileSync(filepath, this.tagInfo.newContent, {
          encoding: this.info.autoUid.encoding || "utf8"
        });
        this.realChangeFiles.push(filepath);
      }
    });
    if (JSON.stringify(this.distJson) !== this.distJsonCache) {
      // 配置发生变更，写入配置
      fs.writeFileSync(this.distAddr, JSON.stringify(this.distJson, null, 2), {
        encoding: "utf-8"
      });
      logSuc(`dist.json changed,rewrite!`);
    }
  }

  getTag(tag, filepath, matchAll = false) {
    let curIndex = 0;
    let result = {
      content: this.curContent,
      newContent: this.curContent,
      data: [],
      filepath: filepath
    };

    let startReg = new RegExp(`<${tag}[^<\\/]*?>`, "i");
    let endRe = new RegExp(`<\\/${tag}>`, "i");

    while (true) {
      let tmpContent = this.curContent.slice(curIndex);
      let tmp = tmpContent.match(startReg);

      if (!tmp) {
        break;
      }

      //console.log( this.curFilepath );

      let nextIndex = curIndex + tmp.index + 1;

      let endResult = this.matchEnd(nextIndex, startReg, endRe, tag.length + 3);
      let endIndex = endResult.end;

      if (endIndex) {
        let data = {
          fullTag: {
            start: curIndex + tmp.index,
            end: endIndex,
            tagContent: this.curContent.slice(curIndex + tmp.index, endIndex)
          },
          innerTag: {
            start: curIndex + tmp.index + tmp[0].length,
            end: endResult.start
          }
        };
        data.innerTag.tagContent = this.curContent.slice(
          data.innerTag.start,
          data.innerTag.end
        );
        result.data.unshift(data);
      }

      curIndex = nextIndex;
      if (!matchAll) {
        break;
      }
    }
    return result;
  }
  matchEnd(nextIndex, startReg, endReg, tagLength) {
    let r = { start: 0, end: 0 };

    let endContent = this.curContent.slice(nextIndex);
    let tmpEnd = endContent.match(endReg);

    if (tmpEnd) {
      let endMatch = this.curContent.slice(
        nextIndex,
        nextIndex + tmpEnd.index + tmpEnd[0].length
      );
      let tmpMatch = endMatch.match(startReg);
      if (tmpMatch) {
        r = this.matchEnd(
          nextIndex + tmpEnd.index + tagLength,
          startReg,
          endReg,
          tmpEnd[0].length
        );
      } else {
        r.start = nextIndex + tmpEnd.index;
        r.end = nextIndex + tmpEnd.index + tmpEnd[0].length;
      }
    }

    return r;
  }
};
