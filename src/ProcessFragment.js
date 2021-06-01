const Uuid = require("uuid/v4");
const parse5 = require("parse5");

export default class ProcessFragment {
  constructor(root) {
    this.filename = root.curFilepath
      .split("/")
      .pop()
      .split(".")[0];
    this.distJson = root.distJson;
    this.ignoretags = root.info.autoUid.ignoretag;
    this.autoUid = root.info.autoUid;
    this.relativeFilePath = root.curFilepath.replace(
      new RegExp(process.cwd()),
      ""
    );
    this.program = root.app.program;
    this.attrname = root.info.autoUid.attrname;
    this.generateIds = this.distJson[this.relativeFilePath] || {}; // 所有生成的id
    this.tempErrorAttrs = {}; //暂存jsx等引起的解析错误
  }
  process(content) {
    let info = this.info;
    let p = this;
    let htmlFragmentParse = parse5.parseFragment(content);

    // 遍历处理所有的nodes
    htmlFragmentParse.childNodes = htmlFragmentParse.childNodes.map(
      (node, index) =>
        this.readNodes({
          item: node,
          parentPath: null,
          index
        })
    );

    // 将生成的ID赋值给Project 一次性写入
    this.distJson[this.relativeFilePath] = this.generateIds;
    // 处理错误的attrs
    let parse5Content = parse5.serialize(htmlFragmentParse);
    Object.keys(this.tempErrorAttrs).forEach(key => {
      parse5Content = parse5Content.replace(
        new RegExp(`"${key}"`, "ig"),
        this.tempErrorAttrs[key]
      );
    });
    // 替换所有的ignore
    parse5Content = parse5Content.replace(/=["']__CLEAN__["']/g, "");
    return parse5Content;
  }

  readNodes({ item, parentPath, index }) {
    if (/(#|#text)/.test(item.nodeName)) {
      return item;
    }
    const fullTagPath = parentPath
      ? `${parentPath}_${item.nodeName}`
      : item.nodeName;

    let childNodes = [];
    if (Array.isArray(item.childNodes) && item.childNodes.length) {
      childNodes = item.childNodes;
    }
    if (
      item.content &&
      Array.isArray(item.content.childNodes) &&
      item.content.childNodes.length
    ) {
      childNodes = item.content.childNodes;
    }
    // 递归处理nodes
    childNodes = childNodes.map((subItem, idx) =>
      this.readNodes({
        item: subItem,
        parentPath: fullTagPath,
        index: idx
      })
    );

    let attrNamesObj = this.processAttrs(item.attrs);

    let distJsonKey = `${fullTagPath}_${index}`;

    // 读文件配置ID 或dom本身已存在ID
    let attrValue =
      this.generateIds[distJsonKey] || attrNamesObj[this.attrname];
    if (!attrValue || this.program.update) {
      // 更新attr
      if (attrNamesObj.id) {
        attrValue = `id#${attrNamesObj.id.value}`;
      } else if (attrNamesObj.class) {
        attrValue = `class.${attrNamesObj.class.value || attrNamesObj.class}`;
      } else {
        attrValue = Uuid()
          .replace(/-/g, "")
          .slice(0, 12);
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
    item.attrs = Object.keys(attrNamesObj).map(name => ({
      name,
      value: attrNamesObj[name]
    }));
    return item;
  }
  processAttrs(attrs = []) {
    // 过滤jsx特殊的value class={}
    let jsxValue, jsxStartIndex, jsxStartName;
    let tempAttrsObj = {};
    attrs.forEach(({ name, value }, index) => {
      if (/^\{/.test(value)) {
        // jsx的属性 ={
        jsxStartIndex = index;
        jsxStartName = name;
        jsxValue = value;
      } else if (/\}$/.test(value) || /\}$/.test(name)) {
        // jsx的属性 }
        jsxValue = jsxValue + " " + name + value;
        let uuidName = Uuid()
          .replace(/-/g, "")
          .slice(0, 12);
        this.tempErrorAttrs[uuidName] = jsxValue;
        tempAttrsObj[jsxStartName] = uuidName;
        jsxValue = undefined;
      } else if (jsxValue) {
        jsxValue = jsxValue + " " + name + value;
      } else if (this.ignoretags.indexOf(name) !== -1 || value == "") {
        // 标签在忽视列表中 或为空值 譬如v-else
        tempAttrsObj[name] = "__CLEAN__";
      } else {
        tempAttrsObj[name] = value;
      }
    });

    return tempAttrsObj;
  }
}
