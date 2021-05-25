'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errorCodes = require('@common/constants/error-codes');

var _errorCodes2 = _interopRequireDefault(_errorCodes);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _errorHandler = require('@common/services/error-handler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _lodash = require('lodash');

var _feedback = require('@common/services/feedback');

var _feedback2 = _interopRequireDefault(_feedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerErrorCodes() {
  _vue2.default.config.errorHandler = function (error, vm, info) {
    (0, _errorHandler2.default)({ error: error, vm: vm, info: info });
    // throw error; // 开发环境将错误输出到控制台方便调试
  };

  _vue2.default.prototype.$throw = function (error) {
    if (typeof error === 'string') {
      error = new Error(error);
    }
    if (!(error instanceof Error)) {
      error = new Error('you should throw error or string');
    }
    throw error;
  };

  _vue2.default.prototype.$errorHandler = function (error) {
    var message = '';
    if ((0, _lodash.isObject)(error) && (0, _lodash.isError)(error.error)) {
      message = error.message;
      if (error.error) {
        message = error.error.message;
      }
    } else {
      message = error;
    }
    _feedback2.default.error(message);
  };

  var errorCodeManager = ErrorCodeManager.getInstance();
  errorCodeManager.register(_errorCodes2.default);
}
exports.default = registerErrorCodes;