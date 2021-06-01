"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _clear = require("clear");

var _clear2 = _interopRequireDefault(_clear);

var _Project2 = require("./Project.js");

var _Project3 = _interopRequireDefault(_Project2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require("./utils/polyfile.js");


var shell = require("shelljs");
var glob = require("glob");
var Uuid = require("uuid/v4");

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword("orange");
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var ProcessFragment = require("./ProcessFragment").default;

var ProjectReplaceVUE = function (_Project) {
  _inherits(ProjectReplaceVUE, _Project);

  function ProjectReplaceVUE(app) {
    _classCallCheck(this, ProjectReplaceVUE);

    return _possibleConstructorReturn(this, (ProjectReplaceVUE.__proto__ || Object.getPrototypeOf(ProjectReplaceVUE)).call(this, app));
  }

  _createClass(ProjectReplaceVUE, [{
    key: "init",
    value: function init() {
      this.gcount = 1;
      this.idmap = {};

      //console.log( this.info );
      this.delimiter = "|||||";
      this.pattern = "{delimiter}{count}{delimiter}{content}{delimiter}";
      //this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi;
      this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?)(\/>|>)/gi;

      this.attrnameRe = new RegExp(this.info.autoUid.attrname + "[\\s]*?\\=", "i");
      this.fixEmptyRe = new RegExp("(" + this.info.autoUid.attrname + "[\\s]*?\\=)('|\")([\\s]*)?\\2", "ig");
      this.fixRepeatRe = new RegExp("(" + this.info.autoUid.attrname + "[\\s]*?\\=)('|\")([a-z0-9\\-\\_]*)?\\2", "ig");
      this.firstSpaceRe = /^([\s]|>)/;
      this.lastSpaceRe = /[\s]$/;
      this.equalContentRe = /(\=[\s]*?)('|")([^\2]*?)\2/g;

      this.tempErrorAttrs = {}; // 支持jsx的错误parse，和v-else等空attrs
      this.attrname = this.info.autoUid.attrname;

      if (this.info.autoUid.ignoretag && this.info.autoUid.ignoretag.length) {
        //this.info.autoUid.ignoretag.remove( 'template' );
        this.ignoreTagRe = new RegExp("^<(" + this.info.autoUid.ignoretag.join("|") + ")\\b", "i");
      }

      this.getChangeFiles();

      // 读取dist配置
      this.distJson = {};
      var dist = _path2.default.resolve(this.info.projectRoot, this.info.autoUid.dist);
      if (_fsExtra2.default.existsSync(dist)) {
        var distFileContent = _fsExtra2.default.readFileSync(dist, {
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
      _fsExtra2.default.writeFileSync(dist, JSON.stringify(this.distJson, null, 2), {
        encoding: "utf-8"
      });
    }
  }, {
    key: "process",
    value: function process() {
      var _this2 = this;

      var p = this;

      this.allFile.map(function (filepath, index) {
        _this2.tag = {};
        _this2.template = [];
        _this2.curCount = 0;
        _this2.curFilepath = filepath;

        _this2.curContent = _fsExtra2.default.readFileSync(filepath, {
          encoding: _this2.info.autoUid.encoding || "utf8"
        });

        //let tagInfo = this.getTag( 'div', filepath, 1 );
        _this2.tagInfo = _this2.getTag("template", filepath, 0);

        _this2.tagInfo.data.map(function (item) {
          var content = new ProcessFragment(_this2).process(item.innerTag.tagContent, filepath);

          _this2.tagInfo.newContent = [_this2.tagInfo.newContent.slice(0, item.innerTag.start), content, _this2.tagInfo.newContent.slice(item.innerTag.end)].join("");
        });

        if (_this2.tagInfo.content != _this2.tagInfo.newContent) {
          console.log(success("auto-uid update file:"), success(filepath));
          _fsExtra2.default.writeFileSync(filepath, _this2.tagInfo.newContent, {
            encoding: _this2.info.autoUid.encoding || "utf8"
          });
          shell.exec("cd '" + _this2.info.projectRoot + "' && git add " + filepath, {
            silent: true
          });
        }
      });
    }
  }, {
    key: "getTag",
    value: function getTag(tag, filepath) {
      var matchAll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var curIndex = 0;
      var result = {
        content: this.curContent,
        newContent: this.curContent,
        data: [],
        filepath: filepath
      };

      var startReg = new RegExp("<" + tag + "[^<\\/]*?>", "i");
      var endRe = new RegExp("<\\/" + tag + ">", "i");

      while (true) {
        var tmpContent = this.curContent.slice(curIndex);
        var tmp = tmpContent.match(startReg);

        if (!tmp) {
          break;
        }

        //console.log( this.curFilepath );

        var nextIndex = curIndex + tmp.index + 1;

        var endResult = this.matchEnd(nextIndex, startReg, endRe, tag.length + 3);
        var endIndex = endResult.end;

        /*
          console.log( curIndex + tmp.index, endIndex );
          console.log( this.curContent.slice( curIndex + tmp.index, endIndex ) );
          */

        if (endIndex) {
          var data = {
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
          data.innerTag.tagContent = this.curContent.slice(data.innerTag.start, data.innerTag.end);
          result.data.unshift(data);
        }

        curIndex = nextIndex;
        if (!matchAll) {
          break;
        }
      }
      return result;
    }
  }, {
    key: "matchEnd",
    value: function matchEnd(nextIndex, startReg, endReg, tagLength) {
      var r = { start: 0, end: 0 };

      var endContent = this.curContent.slice(nextIndex);
      var tmpEnd = endContent.match(endReg);

      if (tmpEnd) {
        var endMatch = this.curContent.slice(nextIndex, nextIndex + tmpEnd.index + tmpEnd[0].length);
        var tmpMatch = endMatch.match(startReg);
        if (tmpMatch) {
          r = this.matchEnd(nextIndex + tmpEnd.index + tagLength, startReg, endReg, tmpEnd[0].length);
        } else {
          r.start = nextIndex + tmpEnd.index;
          r.end = nextIndex + tmpEnd.index + tmpEnd[0].length;
        }
      }

      return r;
    }
  }]);

  return ProjectReplaceVUE;
}(_Project3.default);

exports.default = ProjectReplaceVUE;