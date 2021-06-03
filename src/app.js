const ProjectReplaceVUE = require("./ProjectReplaceVUE.js");

export default class App {
  constructor(options) {
    Object.assign(this, options);
    this.init();
  }

  init() {
    // 第一期默认先支持vue
    this.project = new ProjectReplaceVUE(this);
  }
}

export function init(options) {
  return new App(options);
}
