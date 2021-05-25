'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _definition = require('../definition');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  throw new _definition.BusinessError(message);
};