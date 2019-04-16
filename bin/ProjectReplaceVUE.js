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

var shell = require('shelljs');
var glob = require("glob");

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

var ProjectReplaceVUE = function (_Project) {
    _inherits(ProjectReplaceVUE, _Project);

    function ProjectReplaceVUE(app) {
        _classCallCheck(this, ProjectReplaceVUE);

        var _this = _possibleConstructorReturn(this, (ProjectReplaceVUE.__proto__ || Object.getPrototypeOf(ProjectReplaceVUE)).call(this, app));

        _this.delimiter = '|||||';
        _this.pattern = '{delimiter}{count}{delimiter}{content}{delimiter}';
        return _this;
    }

    _createClass(ProjectReplaceVUE, [{
        key: "init",
        value: function init() {
            console.log(this.app.projectInfo);

            this.getChangeFiles();

            this.process();
            //console.log( 'this.allFile:', this.allFile );
        }
    }, {
        key: "process",
        value: function process() {
            var _this2 = this;

            var p = this;

            this.allFile.map(function (filepath, index) {
                if (index) return;

                _this2.tag = {};
                _this2.template = [];
                _this2.curCount = 0;
                _this2.curFilepath = filepath;

                _this2.curContent = _fsExtra2.default.readFileSync(filepath, { encoding: _this2.info.feuid.encoding || 'utf8' });

                var tagInfo = _this2.getTag('template', 0);

                tagInfo.data.map(function (item) {
                    //console.log( item );
                });

                _this2.getRoot();
            });
        }
    }, {
        key: "getTag",
        value: function getTag(tag) {
            var matchAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var curIndex = 0;
            var result = { content: this.curContent, data: [] };
            while (true) {
                var tmpContent = this.curContent.slice(curIndex);
                var startReg = new RegExp("<" + tag + "[^<\\/]*?>", 'i');
                var tmp = tmpContent.match(startReg);

                if (!tmp) {
                    break;
                }

                console.log(this.curFilepath);

                var nextIndex = curIndex + tmp.index + 1;

                var endResult = this.matchEnd(nextIndex, startReg, new RegExp("<\\/" + tag + ">", 'i'), tag.length + 3);
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
                    result.data.push(data);
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
    }, {
        key: "getRoot",
        value: function getRoot() {}
    }]);

    return ProjectReplaceVUE;
}(_Project3.default);

exports.default = ProjectReplaceVUE;