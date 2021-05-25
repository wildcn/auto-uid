'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('@common/services/request');

var _request2 = _interopRequireDefault(_request);

var _generateHttpResources = require('@common/utils/generate-http-resources');

var _generateHttpResources2 = _interopRequireDefault(_generateHttpResources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 选人组件
/**
 * 传body：resources.xxx.xxx({a: 1})
 * 传params：resources.xxx.xxx(null, { params: { id: 22 } })
 * 传query：resources.xxx.xxx(null, { query: { id: 22 } })
 */
var contact = {
  sectorsFetch: {
    url: 'sector/list'
  },
  staffsFetch: {
    url: 'staff/list'
  },
  staffsSearch: {
    url: 'staff/search'
  },
  orgFetch: {
    url: 'org/fetch',
    method: 'GET'
  }
};

var api = (0, _generateHttpResources2.default)({ contact: contact }, _request2.default);

exports.default = api;