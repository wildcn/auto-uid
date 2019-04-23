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
var Uuid = require('uuid/v4');

var error = _chalk2.default.bold.red;
var warning = _chalk2.default.keyword('orange');
var success = _chalk2.default.greenBright;
var info = _chalk2.default.bold.blue;

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
            this.delimiter = '|||||';
            this.pattern = '{delimiter}{count}{delimiter}{content}{delimiter}';
            //this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?>)/gi;
            this.tagContentRe = /(<[a-z][a-z0-9\-]*)([^<>]*?)(\/>|>)/gi;

            this.attrnameRe = new RegExp(this.info.feuid.attrname + "[\\s]*?\\=", 'i');
            this.fixEmptyRe = new RegExp("(" + this.info.feuid.attrname + "[\\s]*?\\=)('|\")([\\s]*)?\\2", 'ig');
            this.fixRepeatRe = new RegExp("(" + this.info.feuid.attrname + "[\\s]*?\\=)('|\")([a-z0-9\\-\\_]*)?\\2", 'ig');
            this.firstSpaceRe = /^([\s]|>)/;
            this.lastSpaceRe = /[\s]$/;
            this.equalContentRe = /(\=[\s]*?)('|")([^\2]*?)\2/g;

            if (this.info.feuid.ignoretag && this.info.feuid.ignoretag.length) {
                this.ignoreTagRe = new RegExp("^<(" + this.info.feuid.ignoretag.join('|') + ")\\b", 'i');
            }

            this.getChangeFiles();
            this.process();
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

                _this2.curContent = _fsExtra2.default.readFileSync(filepath, { encoding: _this2.info.feuid.encoding || 'utf8' });

                //let tagInfo = this.getTag( 'div', filepath, 1 );
                _this2.tagInfo = _this2.getTag('template', filepath, 0);

                _this2.tagInfo.data.map(function (item) {
                    //console.log( item );
                    var content = _this2.addDataId(item.innerTag.tagContent);

                    _this2.tagInfo.newContent = [_this2.tagInfo.newContent.slice(0, item.innerTag.start), content, _this2.tagInfo.newContent.slice(item.innerTag.end)].join('');
                });

                if (_this2.tagInfo.content != _this2.tagInfo.newContent) {
                    console.log(success('feuid update file:'), success(filepath));
                    _fsExtra2.default.writeFileSync(filepath, _this2.tagInfo.newContent, { encoding: _this2.info.feuid.encoding || 'utf8' });
                    shell.exec("cd '" + _this2.info.projectRoot + "' && git add " + filepath, { silent: true });
                }
            });
        }
    }, {
        key: "addDataId",
        value: function addDataId(content) {
            var info = this.info;
            var p = this;

            var attrPlaceholder = '66FEUID';
            var attrData = {};
            var attrCount = 1;

            if (p.app.program.update) {
                content = content.replace(this.fixRepeatRe, function ($0, $1, $2, $3) {
                    return "" + $1 + $2 + info.feuid.idprefix + p.getUuid() + $2;
                });
            }

            content = content.replace(this.equalContentRe, function ($0, $1, $2, $3) {
                var key = "" + attrPlaceholder + attrCount + attrPlaceholder;
                attrData[key] = $3;
                attrCount++;
                return "" + $1 + $2 + key + $2;
            });

            if (info.feuid.fixempty) {
                content = this.fixEmpty(content);
            }
            if (info.feuid.fixrepeat) {
                content = this.fixRepeat(content);
            }
            content = content.replace(p.tagContentRe, function ($0, $1, $2, $3) {
                var uid = '';
                //if( !/data-testid\=/i.test( $2 ) ){
                var r = "" + $1 + $2 + uid + $3;

                if (p.ignoreTagRe && p.ignoreTagRe.test($1)) {
                    return r;
                }

                if (!p.attrnameRe.test($2)) {
                    uid = info.feuid.attrname + "=\"" + info.feuid.idprefix + p.getUuid() + "\"";
                    if (!p.lastSpaceRe.test($2)) {
                        uid = ' ' + uid;
                    }
                    /*
                    if( !p.firstSpaceRe.test( $2 ) ){
                        uid += ' ';
                    }
                    */
                }
                r = "" + $1 + $2 + uid + $3;
                return r;
            });

            for (var key in attrData) {
                content = content.replace(key, attrData[key]);
            }

            return content;
        }
    }, {
        key: "fixRepeat",
        value: function fixRepeat(content) {

            var count = 0;
            var uuidObj = {};
            var repeatObj = {};
            var p = this;
            content.replace(this.fixRepeatRe, function ($0, $1, $2, $3) {
                uuidObj[$3] = uuidObj[$3] || 0;
                if (uuidObj[$3]) {
                    repeatObj[$3] = uuidObj[$3] + 1;
                }
                uuidObj[$3]++;
            });

            for (var key in repeatObj) {
                var fixRe = new RegExp("(" + this.info.feuid.attrname + "[\\s]*?\\=)('|\")(" + key + ")?\\2", 'ig');
                count = 0;
                content = content.replace(fixRe, function ($0, $1, $2, $3) {
                    if (count) {
                        $3 = this.info.feuid.idprefix + p.getUuid();
                    }
                    count++;
                    return "" + $1 + $2 + $3 + $2;
                });
            }

            return content;
        }
    }, {
        key: "fixEmpty",
        value: function fixEmpty(content) {
            var p = this;

            content = content.replace(this.fixEmptyRe, function ($0, $1, $2, $3) {
                return "" + $1 + $2 + this.info.feuid.idprefix + p.getUuid() + $2;
            });

            return content;
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

            var startReg = new RegExp("<" + tag + "[^<\\/]*?>", 'i');
            var endRe = new RegExp("<\\/" + tag + ">", 'i');

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
    }, {
        key: "getUuid",
        value: function getUuid() {
            var r = (Date.now() + parseInt(Math.random() * Math.pow(10, 12)) + this.gcount++).toString(16);
            //let r =  Uuid().replace( /\-/g, '' );
            if (r in this.idmap) {
                r = this.getUuid();
            }
            this.idmap[r] = this.gcount;
            return r;
        }
    }]);

    return ProjectReplaceVUE;
}(_Project3.default);

exports.default = ProjectReplaceVUE;