'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _App = require('./App.vue');

var _App2 = _interopRequireDefault(_App);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _index = require('./store/index');

var _index2 = _interopRequireDefault(_index);

var _routes = require('@app/configs/routes');

var _routes2 = _interopRequireDefault(_routes);

var _elementUi = require('element-ui');

var _elementUi2 = _interopRequireDefault(_elementUi);

require('@app/styles/index.scss');

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _registerErrorHandler = require('@common/services/register-error-handler');

var _registerErrorHandler2 = _interopRequireDefault(_registerErrorHandler);

var _filters = require('@common/filters');

var filters = _interopRequireWildcard(_filters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register global utility filters.

// 错误处理
Object.keys(filters).forEach(function (key) {
  _vue2.default.filter(key, filters[key]);
});
// 过滤器

// vuex

// ui


_vue2.default.config.productionTip = false;

_router2.default.addRoutes(_routes2.default);
_vue2.default.use(_elementUi2.default);
_vue2.default.use(_vuex2.default);

(0, _registerErrorHandler2.default)();

new _vue2.default({
  router: _router2.default,
  store: _index2.default,
  render: function render(h) {
    return h(_App2.default);
  }
}).$mount('#app');