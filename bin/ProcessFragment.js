"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Uuid = require("uuid/v4");
var parse5 = require("parse5");

var ProcessFragment = function () {
  function ProcessFragment(root) {
    _classCallCheck(this, ProcessFragment);

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
  }

  _createClass(ProcessFragment, [{
    key: "process",
    value: function process(content) {
      var _this = this;

      var info = this.info;
      var p = this;
      var htmlFragmentParse = parse5.parseFragment(content);

      // 遍历处理所有的nodes
      htmlFragmentParse.childNodes = htmlFragmentParse.childNodes.map(function (node, index) {
        return _this.readNodes({
          item: node,
          parentPath: null,
          index: index
        });
      });

      // 将生成的ID赋值给Project 一次性写入
      this.distJson[this.relativeFilePath] = this.generateIds;
      // 处理错误的attrs
      var parse5Content = parse5.serialize(htmlFragmentParse);
      Object.keys(this.tempErrorAttrs).forEach(function (key) {
        parse5Content = parse5Content.replace(new RegExp("\"" + key + "\"", "ig"), _this.tempErrorAttrs[key]);
      });
      // 替换所有的ignore
      parse5Content = parse5Content.replace(/=["']__CLEAN__["']/g, "");
      return parse5Content;
    }
  }, {
    key: "readNodes",
    value: function readNodes(_ref) {
      var _this2 = this;

      var item = _ref.item,
          parentPath = _ref.parentPath,
          index = _ref.index;

      if (/(#|#text)/.test(item.nodeName)) {
        return item;
      }
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
        return _this2.readNodes({
          item: subItem,
          parentPath: fullTagPath,
          index: idx
        });
      });

      var attrNamesObj = this.processAttrs(item.attrs);

      var distJsonKey = fullTagPath + "_" + index;

      // 读文件配置ID 或dom本身已存在ID
      var attrValue = this.generateIds[distJsonKey] || attrNamesObj[this.attrname];
      if (!attrValue || this.program.update) {
        // 更新attr
        if (attrNamesObj.id) {
          attrValue = "id#" + (attrNamesObj.id.value || attrNamesObj.id);
        } else if (attrNamesObj.class) {
          attrValue = "class." + (attrNamesObj.class.value || attrNamesObj.class);
        } else if (this.program.dom) {
          attrValue = fullTagPath;
        } else {
          attrValue = Uuid().replace(/-/g, "").slice(0, 12);
        }
      }
      // attrValue去重
      if (!/@/g.test(attrValue)) {
        if (this.uniqIds[attrValue]) {
          this.uniqIds[attrValue]++;
          attrValue += "@" + this.uniqIds[attrValue];
        } else {
          this.uniqIds[attrValue] = 1;
        }
      }

      if (this.autoUid.idprefix) {
        attrValue = this.info.autoUid.idprefix + attrValue;
      }

      this.generateIds[distJsonKey] = attrValue;
      if (this.program.write) {
        // 写入dom
        attrNamesObj[this.attrname] = attrValue;
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
      item.attrs = Object.keys(attrNamesObj).map(function (name) {
        return {
          name: name,
          value: attrNamesObj[name]
        };
      });
      return item;
    }
  }, {
    key: "processAttrs",
    value: function processAttrs() {
      var _this3 = this;

      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      // 过滤jsx特殊的value class={}
      var jsxValue = void 0,
          jsxStartIndex = void 0,
          jsxStartName = void 0;
      var tempAttrsObj = {};
      attrs.forEach(function (_ref2, index) {
        var name = _ref2.name,
            value = _ref2.value;

        if (/^\{/.test(value)) {
          // jsx的属性 ={
          jsxStartIndex = index;
          jsxStartName = name;
          jsxValue = value;
        } else if (/\}$/.test(value) || /\}$/.test(name)) {
          // jsx的属性 }
          jsxValue = jsxValue + " " + name + value;
          var uuidName = Uuid().replace(/-/g, "").slice(0, 12);
          _this3.tempErrorAttrs[uuidName] = jsxValue;
          tempAttrsObj[jsxStartName] = uuidName;
          jsxValue = undefined;
        } else if (jsxValue) {
          jsxValue = jsxValue + " " + name + value;
        } else if (_this3.ignoretags.indexOf(name) !== -1 || value == "") {
          // 标签在忽视列表中 或为空值 譬如v-else
          tempAttrsObj[name] = "__CLEAN__";
        } else {
          tempAttrsObj[name] = value;
        }
      });

      return tempAttrsObj;
    }
  }]);

  return ProcessFragment;
}();

exports.default = ProcessFragment;