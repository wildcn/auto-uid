const Uuid = require("uuid/v4");
const parse5 = require("parse5");
const { vueAttrsOrder } = require("./configs");
const { logInfo } = require("./utils/debug");

const {
  completeSingleTag,
  sortAttrsByLintRule,
  deleteIgnoreTagEmptyValue,
  revertSingleTag,
  htmlDecode,
  completeJsxAttrs,
  replaceJsxValue,
  readUpperCaseNodeName,
  revertUpperCase,
  transformIgnoreTagOrEmptyTag
} = require("./adapters");

module.exports = class ProcessFragment {
  constructor(root) {
    this.filename = root.curFilepath
      .split("/")
      .pop()
      .split(".")[0];
    this.distJson = root.distJson;
    this.ignoretags = root.info.autoUid.ignoretag;
    this.autoUid = root.info.autoUid;
    // 生成abs:relative的对象
    this.absFilesObj = Object.entries(root.files).reduce((res,item)=>Object.assign(res,{[item[1]]:item[0]}),{})
    // 获取文件的相对路径
    this.relativeFilePath = this.absFilesObj[root.curFilepath];
    logInfo(process.cwd())
    this.program = root.app.program;
    this.attrname = root.info.autoUid.attrname;
    this.generateIds = this.distJson[this.relativeFilePath] || {}; // 所有生成的id
    this.tempErrorAttrs = {}; //暂存jsx等引起的解析错误

    this.uniqIds = {};
    // adapter
    this.registerAdapter();
  }
 
  // 注册拦截器 拦截器内的this会被重定向
  registerAdapter() {
    // 解析readNodes前拦截
    this.beforeReadNodesFunc = [];
    // 解析attrs前的拦截器
    this.beforeAttrsFunc = [
      completeJsxAttrs,
      val => transformIgnoreTagOrEmptyTag(this.ignoretags, val)
    ];
    // 解析attrs完成后的拦截器
    this.afterAttrsFunc = [sortAttrsByLintRule];
    // 解析内容前的拦截器
    this.beforeProcessFunc = [readUpperCaseNodeName, completeSingleTag];
    // 处理完成后的拦截器
    this.afterProcessFuns = [
      deleteIgnoreTagEmptyValue,
      htmlDecode,
      revertSingleTag,
      revertUpperCase,
      replaceJsxValue
    ];
  }
  adapterObs(adapters, content) {
    return adapters.reduce((c, fn) => {
      // const names = fn.toString().match(/function[\s]*([^(]+)/);
      // if (names.length >= 2) {
      //   logInfo(`adapters:${names[1]}`)
      // }
      return fn.call(this, c);
    }, content);
  }
  process(content) {
    let info = this.info;
    let p = this;
    let ct = this.adapterObs(this.beforeProcessFunc, content);
    let htmlFragmentParse = parse5.parseFragment(ct);
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

    return this.adapterObs(this.afterProcessFuns, parse5Content);
  }
  readNodes({ item, parentPath, index }) {
    if (/(#|#text)/.test(item.nodeName)) {
      return item;
    }
    item = this.adapterObs(this.beforeReadNodesFunc, item);
    item.attrs = this.adapterObs(this.beforeAttrsFunc, item.attrs);

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

    let attrNamesObj = item.attrs.reduce(
      (res, item) => Object.assign(res, { [item.name]: item.value }),
      {}
    );
    let distJsonKey = `${fullTagPath}_${index}`;
    // 读文件配置ID 或dom本身已存在ID
    let autoUidValue =
      this.generateIds[distJsonKey] || attrNamesObj[this.attrname];
    if (!autoUidValue || this.program.update) {
      // 更新attr
      if (attrNamesObj.id && this.program.byName) {
        autoUidValue = `id#${attrNamesObj.id.value || attrNamesObj.id}`;
      } else if (attrNamesObj.class && this.program.byName) {
        autoUidValue = `class.${attrNamesObj.class.value ||
          attrNamesObj.class}`;
      } else if (this.program.dom) {
        autoUidValue = fullTagPath;
      } else {
        autoUidValue = Uuid().slice(0, 8);
      }
    }
    // autoUidValue去重
    if (!/@/g.test(autoUidValue)) {
      if (this.uniqIds[autoUidValue]) {
        this.uniqIds[autoUidValue]++;
        autoUidValue += `@${this.uniqIds[autoUidValue]}`;
      } else {
        this.uniqIds[autoUidValue] = 1;
      }
    }

    if (this.autoUid.idprefix) {
      autoUidValue = this.autoUid.idprefix + autoUidValue.replace(new RegExp('^'+this.autoUid.idprefix,'g'),'');
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
    let attrs = Object.keys(attrNamesObj).map(name => ({
      name,
      value: attrNamesObj[name]
    }));
    item.attrs = this.adapterObs(this.afterAttrsFunc, attrs);
    return item;
  }
};
