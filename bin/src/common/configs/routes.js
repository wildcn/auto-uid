'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('@common/views/404');

var _2 = _interopRequireDefault(_);

var _3 = require('@common/views/403');

var _4 = _interopRequireDefault(_3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 公共错误页
var routes = [{
  path: '/403',
  name: '403',
  component: _4.default
}, {
  path: '*',
  name: '404',
  component: _2.default
}];

exports.default = routes;