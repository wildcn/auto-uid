'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('@/common/services/request');

var _request2 = _interopRequireDefault(_request);

var _generateHttpResources = require('@/common/utils/generate-http-resources');

var _generateHttpResources2 = _interopRequireDefault(_generateHttpResources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contact = {
  // 授权管理
  fetch: {
    url: 'addressbook',
    method: 'GET'
  },
  export: {
    url: 'addressbook/export',
    method: 'GET'
  }
};

var api = (0, _generateHttpResources2.default)({ contact: contact }, _request2.default);

exports.default = api;