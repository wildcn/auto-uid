'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('@/common/services/request');

var _request2 = _interopRequireDefault(_request);

var _generateHttpResources = require('@/common/utils/generate-http-resources');

var _generateHttpResources2 = _interopRequireDefault(_generateHttpResources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = {
  // 授权管理
  create: {
    url: 'auth/create',
    method: 'POST'
  },
  modify: {
    url: 'auth/modify',
    method: 'POST'
  },
  delete: {
    url: 'auth/delete',
    method: 'POST'
  },
  reset: {
    url: 'auth/reset',
    method: 'POST'
  },
  token: {
    url: 'auth/token',
    method: 'POST'
  },
  list: {
    url: 'auth/list',
    method: 'GET'
  },
  info: {
    url: 'auth/:authId',
    method: 'GET'
  }
};

var api = (0, _generateHttpResources2.default)({ auth: auth }, _request2.default);

exports.default = api;