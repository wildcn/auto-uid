"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProjectReplaceVUE = require("./ProjectReplaceVUE.js");

var App = function () {
  function App(options) {
    (0, _classCallCheck3.default)(this, App);

    (0, _assign2.default)(this, options);
    this.init();
  }

  (0, _createClass3.default)(App, [{
    key: "init",
    value: function init() {
      // 第一期默认先支持vue
      this.project = new ProjectReplaceVUE(this);
    }
  }]);
  return App;
}();

exports.default = App;
function init(options) {
  return new App(options);
}