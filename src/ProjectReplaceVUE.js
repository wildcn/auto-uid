require("./utils/polyfile.js");
const fs = require("fs-extra");
const path = require("path");
const Uuid = require("uuid/v4");

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

      // this.tagInfo = this.getTag("template", filepath, 0);
      this.tagInfo = this.searilizeTag("template", filepath);

      this.tagInfo.data.map(item => {
        let content = new ProcessFragment(this).process(
          item.content,
          filepath
        );

        this.tagInfo.newContent = [
          this.tagInfo.newContent.slice(0, item.start),
          content,
          this.tagInfo.newContent.slice(item.end)
        ].join("");
      });

      if (this.tagInfo.content != this.tagInfo.newContent) {
        logSuc(`update file,${filepath}`);
        fs.writeFileSync(filepath, this.tagInfo.newContent, {
          encoding: this.info.autoUid.encoding || "utf8"
        });
        this.realChangeFiles.push(p.absFilesObj[filepath]);
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
  /**
   * 按照tag解析字符串
   * @param {String} tag 匹配字符串
   * @param {String} filepath 文件路径
   * @param {Boolean} nesting 是否拆解嵌套匹配的内容
   */
  searilizeTag(tag, filepath, nesting = false) {
    let startReg = new RegExp(`<${tag}[^<\\/]*?>`, "ig");
    let endRe = new RegExp(`<\\/${tag}>`, "ig");
    this.tempContent = this.curContent;
    // 返回的数据
    let result = {
      content: this.curContent,
      newContent: this.curContent,
      filepath,
      data: [] // 匹配到的所有数据 {start,end,content}
    };
    const curContent = this.curContent;

    // 配置tag的位置
    let startMatch = startReg.exec(curContent);
    let endMatch = endRe.exec(curContent);
    let matchIndexs = []; // tag的位置信息
    while (startMatch) {
      matchIndexs.push({
        type: "start",
        end: startReg.lastIndex,
        start: startMatch.index
      });
      startMatch = startReg.exec(curContent);
    }
    while (endMatch) {
      matchIndexs.push({
        type: "end",
        end: endRe.lastIndex,
        start: endMatch.index
      });
      endMatch = endRe.exec(curContent);
    }
    matchIndexs.sort((a, b) => a.start - b.start);

    // 获取所有匹配tag的数据
    const tempStack = [];

    matchIndexs.forEach(curEndInfo => {
      if (curEndInfo.type === "start") {
        tempStack.push(curEndInfo);
      } else {
        // 碰到end 队列中最后的start出列
        const curStartInfo = tempStack.pop();
        if (tempStack.length === 0 || nesting) {
          // 匹配到的根tag
          const { start } = curStartInfo;
          const { end } = curEndInfo;

          const content = curContent.slice(start, end);
          result.data.unshift({
            start,
            end,
            content
          });
        }
      }
    });

    return result;
  }
};
