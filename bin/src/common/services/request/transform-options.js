'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformOptions(options) {
  var method = options.method,
      _options$headers = options.headers,
      headers = _options$headers === undefined ? {} : _options$headers,
      body = options.body;

  // 因为接口加密需要，加密后的内容需要放到 body 中，所以请求默认都采用 POST

  if ((0, _lodash.isUndefined)(method)) {
    options.method = 'POST';
  }

  if ((0, _lodash.isUndefined)(headers['Content-Type']) && (0, _lodash.isObject)(body)) {
    options.headers = Object.assign(headers, {
      'Content-Type': 'application/json'
    });
    options.body = JSON.stringify(body);
  } else if (headers['Content-Type'] === 'multipart/form-data') {
    // fetch在使用formdata上传时，不能设置这个，需要删除让浏览器默认加boundary
    delete headers['Content-Type'];
  }

  if ((0, _lodash.isUndefined)(headers['Transaction-Id'])) {
    options.headers = Object.assign(headers, {
      'Transaction-Id': (0, _v2.default)()
    });
  }
  // 修复固定会话攻击漏洞，登录态区分来源 规则：CoreDevicePlatform_CoreDeviceType
  headers['Source-Control'] = 'BROWSER_ADMIN';
  return options;
}

exports.default = transformOptions;