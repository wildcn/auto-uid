"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("./configs"),
    vueAttrsOrder = _require.vueAttrsOrder;

var Uuid = require("uuid/v4");

var adapter = {
  tempErrorAttrs: {}, //暂存jsx等引起的解析错误

  // 根据vue eslit 规则为attr排序
  sortAttrsByLintRule: function sortAttrsByLintRule(attrs) {
    // eslint vue/attributes-order  https://eslint.vuejs.org/rules/attributes-order.html
    var defaultIndex = vueAttrsOrder.findIndex(function (key) {
      return key === "ANY";
    });
    function getOrderIndex(txt) {
      var idx = defaultIndex;
      vueAttrsOrder.forEach(function (item, index) {
        if (new RegExp("^" + item, "i").test(txt)) {
          idx = index;
        }
      });
      return idx;
    }
    return attrs.sort(function (a, b) {
      return getOrderIndex(b.name) - getOrderIndex(a.name);
    });
  },


  // 删除忽略标签的value
  deleteIgnoreTagEmptyValue: function deleteIgnoreTagEmptyValue(str) {
    return str.replace(/=["']__CLEAN__["']/g, "");
  },

  // 处理所有的single tag ， 例如 <el-table-column /> 否则parse5会识别失败
  completeSingleTag: function completeSingleTag(content) {
    return content.replace(/<([^\s\/>]+)([^(\/>)]+?)\/>/g, function (text, $1, $2) {
      return "<" + $1 + $2 + "></" + $1.replace(/\n/, "") + ">";
    });
  },

  // 还原被处理的单标签
  revertSingleTag: function revertSingleTag(str) {
    return str.replace(/<([^\s\/]+)([.\s]*?)>[\n|\s]*<\/(.*?)>/g, function (matchStr, $1, $2, $3) {
      console.log($1);
      console.log($3);
      if ($1 === $3) {
        return "<" + $1 + $2 + " />";
      }
      return matchStr;
    });
  },

  // 替换jsx的value
  replaceJsxValue: function replaceJsxValue(str) {
    (0, _keys2.default)(adapter.tempErrorAttrs).forEach(function (key) {
      str = str.replace(new RegExp("\"" + key + "\"", "ig"), adapter.tempErrorAttrs[key]);
    });
    return str;
  },

  // 还原被转移的HTML特殊字符
  htmlDecode: function htmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    return s;
  },
  completeJsxAttrs: function completeJsxAttrs() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    // 过滤jsx特殊的value class={}
    var jsxValue = void 0,
        startIndex = void 0,
        jsxStartName = void 0,
        endIndex = void 0;
    var tempAttrs = [];
    attrs.forEach(function (_ref, index) {
      var name = _ref.name,
          value = _ref.value;

      if (adapter.isJsxStart(value)) {
        // jsx的属性 ={
        startIndex = index;
        jsxStartName = name;
        jsxValue = value;
      } else if (adapter.isJsxEnd(name) || adapter.isJsxEnd(value)) {
        // jsx的属性 }
        endIndex = index;
        jsxValue += " " + name + value;
        var uuidName = Uuid().replace(/-/g, "").slice(0, 12);
        adapter.tempErrorAttrs[uuidName] = jsxValue;
        tempAttrs.push({ name: jsxStartName, value: uuidName });
        jsxValue = undefined;
      } else if (jsxValue && index > startIndex) {
        // 是jsx的中间value 拼接一下
        jsxValue += " " + name + value;
      } else {
        tempAttrs.push({ name: name, value: value });
        // tempAttrsObj[name] = value;
      }
    });
    return tempAttrs;
  },

  // 处理v-else等情况
  transformIgnoreTagOrEmptyTag: function transformIgnoreTagOrEmptyTag(ignoreTags, attrs) {
    if (!attrs || !Array.isArray(attrs)) {
      return ignoreTags;
    }
    attrs.forEach(function (item) {
      if (ignoreTags.indexOf(item.name) !== -1) {
        item.value = "__CLEAN__";
      }
    });
    return attrs;
  },
  isJsxStart: function isJsxStart(content) {
    return (/^\{/.test(content) && !/\}$/.test(content)
    );
  },
  isJsxEnd: function isJsxEnd(content) {
    return (/\}$/.test(content) && !/^\{/.test(content)
    );
  }
};

module.exports = adapter;