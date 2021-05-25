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

    this.attrnameRe = new RegExp(`${this.info.feuid2.attrname}[\\s]*?\\=`, "i");
    this.fixEmptyRe = new RegExp(
      `(${this.info.feuid2.attrname}[\\s]*?\\=)('|")([\\s]*)?\\2`,
      "ig"
    );
    this.fixRepeatRe = new RegExp(
      `(${this.info.feuid2.attrname}[\\s]*?\\=)('|")([a-z0-9\\-\\_]*)?\\2`,
      "ig"
    );
    this.firstSpaceRe = /^([\s]|>)/;
    this.lastSpaceRe = /[\s]$/;
    this.equalContentRe = /(\=[\s]*?)('|")([^\2]*?)\2/g;

    this.tempErrorAttrs = {}; // 支持jsx的错误parse，和v-else等空attrs
    this.attrname = this.info.feuid2.attrname;

    if (this.info.feuid2.ignoretag && this.info.feuid2.ignoretag.length) {
      //this.info.feuid2.ignoretag.remove( 'template' );
      this.ignoreTagRe = new RegExp(
        `^<(${this.info.feuid2.ignoretag.join("|")})\\b`,
        "i"
      );
    }

    this.getChangeFiles();

    // 读取dist配置
    this.distJson = {};
    let dist = path.resolve(this.info.projectRoot, this.info.feuid2.dist);
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
        encoding: this.info.feuid2.encoding || "utf8"
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
        console.log(success("feuid2 update file:"), success(filepath));
        fs.writeFileSync(filepath, this.tagInfo.newContent, {
          encoding: this.info.feuid2.encoding || "utf8"
        });
        shell.exec(`cd '${this.info.projectRoot}' && git add ${filepath}`, {
          silent: true
        });
      }
    });
  }
}
