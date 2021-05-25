'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function bodyParse(body) {
  // 兼容错误直接返回给body的情况
  var hasErr = (0, _lodash.has)(body, 'error');
  var code = hasErr ? (0, _lodash.get)(body, 'error.code') : (0, _lodash.get)(body, 'code');
  if (!(0, _lodash.isUndefined)(code)) {
    var msg = (0, _lodash.has)(body, 'error.msg') || (0, _lodash.has)(body, 'msg') ? 'msg' : 'message';
    var message = hasErr ? (0, _lodash.get)(body, 'error[' + msg + ']') : (0, _lodash.get)(body, msg);
    var error = new BusinessError({ code: code, message: message });

    // 临时方案，之后考虑直接更改error-definition
    error.detail = hasErr ? (0, _lodash.get)(body, 'error.detail') : (0, _lodash.get)(body, 'detail');
    throw error;
  }

  return body;
}

exports.default = bodyParse;