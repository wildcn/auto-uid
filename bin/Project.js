"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _clear = require("clear");

var _clear2 = _interopRequireDefault(_clear);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _constant = require("./data/constant.js");

var CONST = _interopRequireWildcard(_constant);

var _data = require("./data/data.js");

var DATA = _interopRequireWildcard(_data);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glob = require('glob');

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var Project = function () {
    function Project(app) {
        var _this = this;

        _classCallCheck(this, Project);

        this.app = app;
        this.info = this.app.projectInfo;

        this.newFile = [];
        this.modifiedFile = [];
        this.allFile = [];
        this.allRelativeFile = [];

        this.info.autoUid.dir.map(function (item, index) {
            _this.info.autoUid.dir[index] = item.replace(/[\/]+$/, '');
        });
        this.dirRe = new RegExp("^(" + this.info.autoUid.dir.join('|') + ")/", 'i');

        this.newRe = /new[\s]+file:[\s]+(.*)/;
        this.modifiedRe = /modified:[\s]+(.*)/;
        this.fixRe = /^(\/|\\)/;
        this.extensionRe = new RegExp("\\.(vue)$", 'i');

        this.init();
    }

    _createClass(Project, [{
        key: "init",
        value: function init() {}
    }, {
        key: "initMethod",
        value: function initMethod() {
            //console.log( 'initMethod', Date.now() );
        }
    }, {
        key: "getChangeFiles",
        value: function getChangeFiles() {
            var p = this;

            if (this.app.program.full || this.app.program.clean) {
                p.info.autoUid.dir.map(function (item) {
                    var globRe = p.info.projectRoot + "/" + item + "/**/*.+(" + p.info.autoUid.extension.join('|') + ")";
                    p.allFile = p.allFile.concat(glob.sync(globRe, {}));
                    p.allRelativeFile = p.allFile.concat(glob.sync(globRe, {}));
                });
                return;
            }

            if (this.app.program.dir) {
                this.app.program.dir.split(',').map(function (item) {
                    var globRe = p.info.projectRoot + "/" + item + "/**/*.+(" + p.info.autoUid.extension.join('|') + ")";
                    p.allFile = p.allFile.concat(glob.sync(globRe, {}));
                    p.allRelativeFile = p.allFile.concat(glob.sync(globRe, {}));
                });
            }

            if (this.app.program.target) {
                console.log(this.app.program.target);
                p.allFile.push(_path2.default.resolve(this.app.program.target));
                p.allRelativeFile.push(this.app.program.target);
                return;
            }

            var gitStatus = void 0,
                lines = void 0;
            gitStatus = _shelljs2.default.exec("cd '" + this.info.currentRoot + "' && git status", { silent: true });
            lines = gitStatus.stdout.split('\n');

            lines.map(function (item, index) {
                item = item.trim();
                item.replace(p.newRe, function ($0, $1) {
                    p.fileReplaceAction($0, $1, p.newFile);
                });

                item.replace(p.modifiedRe, function ($0, $1) {
                    p.fileReplaceAction($0, $1, p.modifiedFile);
                });
            });
        }
    }, {
        key: "fileReplaceAction",
        value: function fileReplaceAction($0, $1, ar) {
            var info = this.info;
            var p = this;

            var fullpath = _path2.default.join(info.currentRoot, $1);
            var filepath = fullpath.replace(info.projectRoot, '').replace(this.fixRe, '');

            if (this.extensionRe.test($1) && p.dirRe.test(filepath)) {
                ar.push(fullpath);
                p.allFile.push(fullpath);
            }
        }
    }]);

    return Project;
}();

exports.default = Project;