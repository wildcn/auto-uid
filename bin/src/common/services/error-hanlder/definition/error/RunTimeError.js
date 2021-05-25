"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 主要是window.onerror的错误，即JS运行时错误、语法错误
 * window.onerror = (msg, url, lineNum, colNum, err) => {
  console.log(`错误发生的异常信息（字符串）:${msg}`)
  console.log(`错误发生的脚本URL（字符串）:${url}`)
  console.log(`错误发生的行号（数字）:${lineNum}`)
  console.log(`错误发生的列号（数字）:${colNum}`)
  console.log(`错误发生的Error对象（错误对象）:${err}`)
};


<!-- 增加 crossorigin 属性后，浏览器将自动在请求头中添加一个 Origin 字段,告诉服务器自己的来源，服务器再判断是否返回 -->
<script src="http://xxx.xxx.xxx.x/xxx.js" crossorigin></script>

已解决错误行和列不对的问题

 * */
var RunTimeError = function (_Error) {
  _inherits(RunTimeError, _Error);

  function RunTimeError(_ref) {
    var code = _ref.code,
        message = _ref.message,
        url = _ref.url,
        lineNum = _ref.lineNum,
        colNum = _ref.colNum;

    _classCallCheck(this, RunTimeError);

    var _this = _possibleConstructorReturn(this, (RunTimeError.__proto__ || Object.getPrototypeOf(RunTimeError)).call(this, message));

    _this.code = code;
    return _this;
  }

  return RunTimeError;
}(Error);

exports.default = RunTimeError;