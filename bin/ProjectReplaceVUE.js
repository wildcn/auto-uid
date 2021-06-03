"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("./utils/polyfile.js");
var fs = require("fs-extra");
var path = require("path");

var _require = require("./utils/debug"),
    logSuc = _require.logSuc,
    logErr = _require.logErr,
    logInfo = _require.logInfo,
    logWar = _require.logWar;

var ProcessFragment = require("./ProcessFragment");

var Project = require("./Project.js");

module.exports = function (_Project) {
  (0, _inherits3.default)(ProjectReplaceVUE, _Project);

  function ProjectReplaceVUE(app) {
    (0, _classCallCheck3.default)(this, ProjectReplaceVUE);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ProjectReplaceVUE.__proto__ || (0, _getPrototypeOf2.default)(ProjectReplaceVUE)).call(this, app));

    _this.app = app;
    _this.tempErrorAttrs = {}; // 支持jsx的错误parse，和v-else等空attrs
    _this.attrname = _this.info.autoUid.attrname;
    _this.distJson = {};
    _this.distAddr = path.resolve(_this.info.projectRoot, _this.info.autoUid.dist);
    _this.realChangeFiles = [];
    _this.readDistJson();
    if (_this.app.autoCommnad) {
      logInfo("auto Command model!");
      _this.init();
    }
    return _this;
  }

  (0, _createClass3.default)(ProjectReplaceVUE, [{
    key: "init",
    value: function init() {
      this.getChangeFiles();
      // 自动处理
      this.process();
    }
  }, {
    key: "readDistJson",
    value: function readDistJson() {
      logInfo("readDistJson");
      // 读取dist配置
      if (fs.existsSync(this.distAddr)) {
        var distFileContent = fs.readFileSync(this.distAddr, {
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
      this.distJsonCache = (0, _stringify2.default)(this.distJson);
    }
  }, {
    key: "process",
    value: function process() {
      var _this2 = this;

      logInfo("ProjectVue process");
      var p = this;
      if (this.changeFiles.length === 0) {
        this.getChangeFiles();
      }
      if (this.changeFiles.length === 0) {
        logErr("no changeFiles read, please check auto-uid.config.js or new (options)");
      }
      this.changeFiles.map(function (filepath, index) {
        _this2.tag = {};
        _this2.template = [];
        _this2.curFilepath = filepath;
        _this2.curContent = fs.readFileSync(filepath, {
          encoding: _this2.info.autoUid.encoding || "utf8"
        });

        _this2.tagInfo = _this2.getTag("template", filepath, 0);

        _this2.tagInfo.data.map(function (item) {
          var content = new ProcessFragment(_this2).process(item.innerTag.tagContent, filepath);

          _this2.tagInfo.newContent = [_this2.tagInfo.newContent.slice(0, item.innerTag.start), content, _this2.tagInfo.newContent.slice(item.innerTag.end)].join("");
        });

        if (_this2.tagInfo.content != _this2.tagInfo.newContent) {
          logSuc("update file," + filepath);
          fs.writeFileSync(filepath, _this2.tagInfo.newContent, {
            encoding: _this2.info.autoUid.encoding || "utf8"
          });
          _this2.realChangeFiles.push(filepath);
        }
      });
      if ((0, _stringify2.default)(this.distJson) !== this.distJsonCache) {
        // 配置发生变更，写入配置
        fs.writeFileSync(this.distAddr, (0, _stringify2.default)(this.distJson, null, 2), {
          encoding: "utf-8"
        });
        logSuc("dist.json changed,rewrite!");
      }
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
}(Project);