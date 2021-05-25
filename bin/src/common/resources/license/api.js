'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REQUEST_BASE_URL = exports.license = undefined;

var _request = require('@/common/services/request');

var _request2 = _interopRequireDefault(_request);

var _generateHttpResources = require('@/common/utils/generate-http-resources');

var _generateHttpResources2 = _interopRequireDefault(_generateHttpResources);

var _constants = require('@common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 接口文档 https://api.qianxin-inc.cn/independent/#/home/api_studio/inside/api/list?groupID=27030&projectHashKey=qV9cdZn67e378723d5225158b6db7033075fe65abb94a25&spaceKey=tQY1Se98fb4cd8c8b37537680c4070ad4448298f6c508d1
var license = {
  fetchRemind: {
    url: 'license/remind/fetch',
    method: 'GET'
  },
  setRemind: {
    url: 'license/remind/set',
    method: 'POST'
  },
  info: {
    url: 'license/statistic/fetch',
    method: 'GET'
  },
  list: {
    url: 'license/list',
    method: "GET"
  },
  confirm: {
    url: 'license/confirm',
    method: 'POST'
  },
  upload: {
    url: 'license/upload',
    method: 'POST'
  },
  reConfirm: {
    url: 'license/reconfirm',
    method: 'POST'
  },
  reUpload: {
    url: 'license/reupload',
    method: 'POST'
  },
  precreate: {
    method: 'GET',
    url: 'license/precreate'
  }
};

// 调用mock数据

// Object.keys(license).forEach(item => {
//   license[item].url = MOCK_API_PERFIX + license[item].url;
// })

var api = (0, _generateHttpResources2.default)({ license: license }, _request2.default);

exports.default = api;
exports.license = license;
exports.REQUEST_BASE_URL = _constants.REQUEST_BASE_URL;