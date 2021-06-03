"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Uuid = require("uuid/v4");
var parse5 = require("parse5");

var _require = require("./configs"),
    vueAttrsOrder = _require.vueAttrsOrder;

var _require2 = require("./utils/debug"),
    logInfo = _require2.logInfo;

var _require3 = require("./adapters"),
    completeSingleTag = _require3.completeSingleTag,
    sortAttrsByLintRule = _require3.sortAttrsByLintRule,
    deleteIgnoreTagEmptyValue = _require3.deleteIgnoreTagEmptyValue,
    revertSingleTag = _require3.revertSingleTag,
    htmlDecode = _require3.htmlDecode,
    completeJsxAttrs = _require3.completeJsxAttrs,
    replaceJsxValue = _require3.replaceJsxValue,
    readUpperCaseNodeName = _require3.readUpperCaseNodeName,
    filterUpperCaseStr = _require3.filterUpperCaseStr,
    revertUpperCaseNodeName = _require3.revertUpperCaseNodeName,
    transformIgnoreTagOrEmptyTag = _require3.transformIgnoreTagOrEmptyTag;

module.exports = function () {
  function ProcessFragment(root) {
    (0, _classCallCheck3.default)(this, ProcessFragment);

    this.filename = root.curFilepath.split("/").pop().split(".")[0];
    this.distJson = root.distJson;
    this.ignoretags = root.info.autoUid.ignoretag;
    this.autoUid = root.info.autoUid;
    this.relativeFilePath = root.curFilepath.replace(new RegExp(process.cwd()), "");
    this.program = root.app.program;
    this.attrname = root.info.autoUid.attrname;
    this.generateIds = this.distJson[this.relativeFilePath] || {}; // 所有生成的id
    this.tempErrorAttrs = {}; //暂存jsx等引起的解析错误

    this.uniqIds = {};
    // adapter
    this.registerAdapter();
  }
  // 注册拦截器 拦截器内的this会被重定向


  (0, _createClass3.default)(ProcessFragment, [{
    key: "registerAdapter",
    value: function registerAdapter() {
      var _this = this;

      // 解析readNodes前拦截
      this.beforeReadNodesFunc = [filterUpperCaseStr];
      // 解析attrs前的拦截器
      this.beforeAttrsFunc = [completeJsxAttrs, function (val) {
        return transformIgnoreTagOrEmptyTag(_this.ignoretags, val);
      }];
      // 解析attrs完成后的拦截器
      this.afterAttrsFunc = [sortAttrsByLintRule];
      // 解析内容前的拦截器
      this.beforeProcessFunc = [readUpperCaseNodeName, completeSingleTag];
      // 处理完成后的拦截器
      this.afterProcessFuns = [deleteIgnoreTagEmptyValue, htmlDecode, revertSingleTag, revertUpperCaseNodeName, replaceJsxValue];
    }
  }, {
    key: "adapterObs",
    value: function adapterObs(adapters, content) {
      var _this2 = this;

      return adapters.reduce(function (c, fn) {
        // const names = fn.toString().match(/function[\s]*([^(]+)/);
        // if (names.length >= 2) {
        //   logInfo(`adapters:${names[1]}`)
        // }
        return fn.call(_this2, c);
      }, content);
    }
  }, {
    key: "process",
    value: function process(content) {
      var _this3 = this;

      var info = this.info;
      var p = this;
      var ct = this.adapterObs(this.beforeProcessFunc, content);
      var htmlFragmentParse = parse5.parseFragment(ct);
      // 遍历处理所有的nodes
      htmlFragmentParse.childNodes = htmlFragmentParse.childNodes.map(function (node, index) {
        return _this3.readNodes({
          item: node,
          parentPath: null,
          index: index
        });
      });

      // 将生成的ID赋值给Project 一次性写入
      this.distJson[this.relativeFilePath] = this.generateIds;
      // 处理错误的attrs
      var parse5Content = parse5.serialize(htmlFragmentParse);

      return this.adapterObs(this.afterProcessFuns, parse5Content);
    }
  }, {
    key: "readNodes",
    value: function readNodes(_ref) {
      var _this4 = this;

      var item = _ref.item,
          parentPath = _ref.parentPath,
          index = _ref.index;

      if (/(#|#text)/.test(item.nodeName)) {
        return item;
      }
      item = this.adapterObs(this.beforeReadNodesFunc, item);
      item.attrs = this.adapterObs(this.beforeAttrsFunc, item.attrs);

      var fullTagPath = parentPath ? parentPath + "_" + item.nodeName : item.nodeName;

      var childNodes = [];
      if (Array.isArray(item.childNodes) && item.childNodes.length) {
        childNodes = item.childNodes;
      }
      if (item.content && Array.isArray(item.content.childNodes) && item.content.childNodes.length) {
        childNodes = item.content.childNodes;
      }
      // 递归处理nodes
      childNodes = childNodes.map(function (subItem, idx) {
        return _this4.readNodes({
          item: subItem,
          parentPath: fullTagPath,
          index: idx
        });
      });

      var attrNamesObj = item.attrs.reduce(function (res, item) {
        return (0, _assign2.default)(res, (0, _defineProperty3.default)({}, item.name, item.value));
      }, {});
      var distJsonKey = fullTagPath + "_" + index;

      // 读文件配置ID 或dom本身已存在ID
      var autoUidValue = this.generateIds[distJsonKey] || attrNamesObj[this.attrname];
      if (!autoUidValue || this.program.update) {
        // 更新attr
        if (attrNamesObj.id && this.program.byName) {
          autoUidValue = "id#" + (attrNamesObj.id.value || attrNamesObj.id);
        } else if (attrNamesObj.class && this.program.byName) {
          autoUidValue = "class." + (attrNamesObj.class.value || attrNamesObj.class);
        } else if (this.program.dom) {
          autoUidValue = fullTagPath;
        } else {
          autoUidValue = Uuid().replace(/-/g, "").slice(0, 12);
        }
      }
      // autoUidValue去重
      if (!/@/g.test(autoUidValue)) {
        if (this.uniqIds[autoUidValue]) {
          this.uniqIds[autoUidValue]++;
          autoUidValue += "@" + this.uniqIds[autoUidValue];
        } else {
          this.uniqIds[autoUidValue] = 1;
        }
      }

      if (this.autoUid.idprefix) {
        autoUidValue = this.info.autoUid.idprefix + autoUidValue;
      }

      this.generateIds[distJsonKey] = autoUidValue;
      if (this.program.write) {
        // 写入dom
        attrNamesObj[this.attrname] = autoUidValue;
      }
      if (this.program.clean) {
        // 清除生成的id
        delete attrNamesObj[this.attrname];
      }
      // ignore tags
      if (this.ignoretags.indexOf(item.nodeName) !== -1) {
        delete attrNamesObj[this.attrname];
      }
      // 先找到dom中是否存在class或者id
      var attrs = (0, _keys2.default)(attrNamesObj).map(function (name) {
        return {
          name: name,
          value: attrNamesObj[name]
        };
      });
      item.attrs = this.adapterObs(this.afterAttrsFunc, attrs);
      return item;
    }
  }]);
  return ProcessFragment;
}();