'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _elementUi = require('element-ui');

exports.default = {
  error: function error(message) {
    (0, _elementUi.Message)({
      showClose: true,
      message: message,
      type: 'error',
      offset: 60
    });
  }
};