"use strict";

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require("path");
var glob = require("glob");

var _require = require("./utils/debug"),
    logInfo = _require.logInfo;

module.exports = function () {
  function Project(app) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Project);

    this.app = app;
    this.info = this.app.projectInfo;
    this.changeFiles = [];
    this.files = {};
    this.info.autoUid.dir.map(function (item, index) {
      _this.info.autoUid.dir[index] = item.replace(/[\/]+$/, "");
    });
  }
  // 获取操作需要的文件列表


  (0, _createClass3.default)(Project, [{
    key: "getChangeFiles",
    value: function getChangeFiles() {
      logInfo("getChangeFiles");
      var p = this;
      var program = this.program || this.app.program || {};
      var cwd = process.cwd();
      if (program.full || program.clean) {
        p.info.autoUid.dir.map(function (item) {
          var relativeGlobReg = item + "/**/*.+(" + p.info.autoUid.extension.join("|") + ")";
          glob.sync(relativeGlobReg, {}).forEach(function (relativeFilePath) {
            p.files[relativeFilePath] = path.resolve(cwd, relativeFilePath);
          });
        });
      }

      if (program.dir) {
        program.dir.split(",").map(function (item) {
          var relativeGlobReg = item + "/**/*.+(" + p.info.autoUid.extension.join("|") + ")";
          glob.sync(relativeGlobReg, {}).forEach(function (relativeFilePath) {
            p.files[relativeFilePath] = path.resolve(cwd, relativeFilePath);
          });
        });
      }

      if (program.target && fs.existsSync(path.resolve(cwd, program.target))) {
        p.files[program.target] = path.resolve(cwd, program.target);
      }
      logInfo(p.files);
      p.changeFiles = (0, _values2.default)(p.files);
      return p.changeFiles;
    }
  }]);
  return Project;
}();