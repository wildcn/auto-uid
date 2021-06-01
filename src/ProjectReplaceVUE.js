require("./utils/polyfile.js");
import fs from "fs-extra";
import path from "path";

import chalk from "chalk";
import clear from "clear";

const shell = require("shelljs");
const glob = require("glob");
const Uuid = require("uuid/v4");

const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const success = chalk.greenBright;
const info = chalk.bold.blue;

const ProcessFragment = require("./ProcessFragment").default;

import Project from "./Project.js";

export default class ProjectReplaceVUE extends Project {
  constructor(app) {
    super(app);
  }

  init() {
    this.gcount = 1;
    this.idmap = {};

    //console.log( this.info );
    this.delimiter = "|||||";
    this.pattern = "{delimiter}{count}{delimiter}{content}{delimiter}";
    //this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi;
    this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?)(\/>|>)/gi;

    this.attrnameRe = new RegExp(`${this.info.autoUid.attrname}[\\s]*?\\=`, "i");
    this.fixEmptyRe = new RegExp(
      `(${this.info.autoUid.attrname}[\\s]*?\\=)('|")([\\s]*)?\\2`,
      "ig"
    );
    this.fixRepeatRe = new RegExp(
      `(${this.info.autoUid.attrname}[\\s]*?\\=)('|")([a-z0-9\\-\\_]*)?\\2`,
      "ig"
    );
    this.firstSpaceRe = /^([\s]|>)/;
    this.lastSpaceRe = /[\s]$/;
    this.equalContentRe = /(\=[\s]*?)('|")([^\2]*?)\2/g;

    this.tempErrorAttrs = {}; // 支持jsx的错误parse，和v-else等空attrs
    this.attrname = this.info.autoUid.attrname;

    if (this.info.autoUid.ignoretag && this.info.autoUid.ignoretag.length) {
      //this.info.autoUid.ignoretag.remove( 'template' );
      this.ignoreTagRe = new RegExp(
        `^<(${this.info.autoUid.ignoretag.join("|")})\\b`,
        "i"
      );
    }

    this.getChangeFiles();

    // 读取dist配置
    this.distJson = {};
    let dist = path.resolve(this.info.projectRoot, this.info.autoUid.dist);
    if (fs.existsSync(dist)) {
      let distFileContent = fs.readFileSync(dist, {
        encoding: "utf-8"
      });
      if (distFileContent) {
        try {
          this.distJson = JSON.parse(distFileContent);
        } catch (err) {
          warning(err);
        }
      }
    }
    this.process();
    fs.writeFileSync(dist, JSON.stringify(this.distJson, null, 2), {
      encoding: "utf-8"
    });
  }

  process() {
    let p = this;

    this.allFile.map((filepath, index) => {
      this.tag = {};
      this.template = [];
      this.curCount = 0;
      this.curFilepath = filepath;

      this.curContent = fs.readFileSync(filepath, {
        encoding: this.info.autoUid.encoding || "utf8"
      });

      //let tagInfo = this.getTag( 'div', filepath, 1 );
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
        console.log(success("auto-uid update file:"), success(filepath));
        fs.writeFileSync(filepath, this.tagInfo.newContent, {
          encoding: this.info.autoUid.encoding || "utf8"
        });
        shell.exec(`cd '${this.info.projectRoot}' && git add ${filepath}`, {
          silent: true
        });
      }
    });
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

      /*
        console.log( curIndex + tmp.index, endIndex );
        console.log( this.curContent.slice( curIndex + tmp.index, endIndex ) );
        */

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
}
