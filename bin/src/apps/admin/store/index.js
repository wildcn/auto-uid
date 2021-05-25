'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _conf = require('./conf');

var _conf2 = _interopRequireDefault(_conf);

var _conference = require('./conference');

var _conference2 = _interopRequireDefault(_conference);

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
  modules: {
    conf: _conf2.default,
    conference: _conference2.default,
    menu: _menu2.default
  },
  strict: process.env.NODE_ENV !== 'production'
});

exports.default = store;