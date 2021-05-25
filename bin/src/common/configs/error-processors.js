'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _oauth = require('../services/oauth');

var _oauth2 = _interopRequireDefault(_oauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBOUNCE_TIME = 500;
var errorHandler = function errorHandler(error, vm, info) {
  vm.$errorHandler(error);
};

var errorProcessors = [{
  assert: function assert(error) {
    return ErrorAssert.isTimeout(error);
  },
  processor: function processor(_ref) {
    var vm = _ref.vm,
        info = _ref.info;

    (0, _lodash.debounce)(function () {
      return errorHandler('请求超时请重试', vm, info);
    }, DEBOUNCE_TIME)();
  }
}, {
  assert: function assert(error) {
    return ErrorAssert.isOffline(error);
  },
  processor: function processor(_ref2) {
    var vm = _ref2.vm,
        info = _ref2.info;

    (0, _lodash.debounce)(function () {
      return errorHandler('网络异常', vm, info);
    }, DEBOUNCE_TIME)();
  }
}, {
  assert: function assert(error) {
    return ErrorAssert.isInternalError(error);
  },
  processor: function processor(_ref3) {
    var vm = _ref3.vm,
        info = _ref3.info;

    (0, _lodash.debounce)(function () {
      return errorHandler('服务不可用', vm, info);
    }, DEBOUNCE_TIME)();
  }
}, {
  assert: function assert(error) {
    return ErrorAssert.isPermissionDenied(error);
  },
  processor: function processor(_ref4) {
    var vm = _ref4.vm;

    vm.$router.replace({ name: '403' });
  }
}, {
  assert: function assert(error) {
    return ErrorAssert.isUnauthorized(error);
  },
  processor: function processor(_ref5) {
    var error = _ref5.error,
        vm = _ref5.vm;
    var detail = error.detail;

    vm.$store.commit('updateOauthUrl', detail[0]);
    vm.$router.push({ name: 'login' });
    // oauth(detail[0]); // 默认不跳转，需要用户交互
  }
}, {
  assert: function assert(error) {
    return ErrorAssert.isInvalidReqParam(error);
  },
  processor: function processor(_ref6) {
    var vm = _ref6.vm,
        info = _ref6.info;

    (0, _lodash.debounce)(function () {
      return errorHandler('请求参数错误', vm, info);
    }, DEBOUNCE_TIME)();
  }
}];

exports.default = errorProcessors;