const { vueAttrsOrder } = require("./configs");
const Uuid = require("uuid/v4");

const adapter = {
  tempErrorAttrs: {}, //暂存jsx等引起的解析错误
  
  // 根据vue eslit 规则为attr排序
  sortAttrsByLintRule(attrs) {
    // eslint vue/attributes-order  https://eslint.vuejs.org/rules/attributes-order.html
    let defaultIndex = vueAttrsOrder.findIndex(key => key === "ANY");
    function getOrderIndex(txt) {
      let idx = defaultIndex;
      vueAttrsOrder.forEach((item, index) => {
        if (new RegExp(`^${item}`, "i").test(txt)) {
          idx = index;
        }
      });
      return idx;
    }
    return attrs.sort((a, b) => getOrderIndex(b.name) - getOrderIndex(a.name));
  },
  
  // 删除忽略标签的value
  deleteIgnoreTagEmptyValue(str) {
    return str.replace(/=["']__CLEAN__["']/g, "");
  },
  // 处理所有的single tag ， 例如 <el-table-column /> 否则parse5会识别失败
  completeSingleTag(content) {
    return content.replace(/<([^\s\/>]+)([^(\/>)]+?)\/>/g, function(text, $1, $2) {
      return `<${$1}${$2}></${$1.replace(/\n/, "")}>`;
    });
  },
  // 还原被处理的单标签
  revertSingleTag(str) {
    return str.replace(/<([^\s\/]+)([.\s]*?)>[\n|\s]*<\/(.*?)>/g, function(
      matchStr,
      $1,
      $2,
      $3
    ) {
      console.log($1)
      console.log($3)
      if ($1 === $3) {
        return `<${$1}${$2} />`;
      }
      return matchStr;
    });
  },
  // 替换jsx的value
  replaceJsxValue(str) {
    Object.keys(adapter.tempErrorAttrs).forEach(key => {
      str = str.replace(
        new RegExp(`"${key}"`, "ig"),
        adapter.tempErrorAttrs[key]
      );
    });
    return str;
  },
  // 还原被转移的HTML特殊字符
  htmlDecode(str) {
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
  completeJsxAttrs(attrs = []) {
    // 过滤jsx特殊的value class={}
    let jsxValue, startIndex, jsxStartName, endIndex;
    let tempAttrs = [];
    attrs.forEach(({ name, value }, index) => {
      if (adapter.isJsxStart(value)) {
        // jsx的属性 ={
        startIndex = index;
        jsxStartName = name;
        jsxValue = value;
      } else if (adapter.isJsxEnd(name) || adapter.isJsxEnd(value)) {
        // jsx的属性 }
        endIndex = index;
        jsxValue += " " + name + value;
        let uuidName = Uuid()
          .replace(/-/g, "")
          .slice(0, 12);
        adapter.tempErrorAttrs[uuidName] = jsxValue;
        tempAttrs.push({ name: jsxStartName, value: uuidName });
        jsxValue = undefined;
      } else if (jsxValue && index > startIndex) {
        // 是jsx的中间value 拼接一下
        jsxValue += " " + name + value;
      } else {
        tempAttrs.push({ name, value });
        // tempAttrsObj[name] = value;
      }
    });
    return tempAttrs;
  },
  // 处理v-else等情况
  transformIgnoreTagOrEmptyTag(ignoreTags, attrs) {
    if (!attrs || !Array.isArray(attrs)) {
      return ignoreTags;
    }
    attrs.forEach(item => {
      if (ignoreTags.indexOf(item.name) !== -1) {
        item.value = "__CLEAN__";
      }
    });
    return attrs;
  },
  isJsxStart(content) {
    return /^\{/.test(content) && !/\}$/.test(content);
  },
  isJsxEnd(content) {
    return /\}$/.test(content) && !/^\{/.test(content);
  }
};

module.exports = adapter;
