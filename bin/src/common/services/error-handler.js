'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errorProcessors = require('@common/configs/error-processors');

var _errorProcessors2 = _interopRequireDefault(_errorProcessors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {*} error 捕获的错误
 * @param {*} vm 抛出错误的上下文 this 示例
 * @param {*} info 错误补充说明，辅助定位错误产生位置
 *
 * 可以捕捉的错误：
 *   1. 同步函数链抛出的错误；
 *   2. promise 链抛出的错误。（注：watch 中 promise 链抛出的错误暂时无法捕捉）
 *
 * 无法捕捉的错误：
 *   1. 同步函数中调用异步函数时异步函数抛出的错误；
 *   2. 异步函数中未使用 await 调用异步函数时被调异步函数抛出的错误；
 *   3. watch 中 promise 链抛出的错误。（注：截止当前最新的 vue2.6.9 仍不支持）
 * 无法捕捉的错误可以使用 main.js 中声明的 this.$throw(xxx) 处理。
 */
function errorHandler(_ref) {
  var error = _ref.error,
      vm = _ref.vm,
      info = _ref.info;

  if (error instanceof Error) {
    var errorConfig = _errorProcessors2.default.find(function (config) {
      return config.assert(error);
    });
    if (errorConfig !== undefined) {
      errorConfig.processor({ error: error, vm: vm, info: info });
    } else {
      vm.$errorHandler({ error: error, vm: vm, info: info });
    }
  }
}

exports.default = errorHandler;