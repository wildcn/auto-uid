'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _conference = require('@common/resources/conference');

var _selection = require('@common/resources/selection');

var _license = require('@common/resources/license');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var state = {
  // visitor信息
  staffInfo: undefined,
  // 全局配置
  conf: {}, // conf接口数据
  // 403跳转
  oauthUrl: undefined,
  // 组织信息
  org: {},
  // 授权中心
  license: {},
  // 全局提醒消息池
  message: []
};

var getters = {};

var mutations = {
  updateStaffInfo: function updateStaffInfo(state, staffInfo) {
    state.staffInfo = staffInfo;
  },

  updateOauthUrl: function updateOauthUrl(state, url) {
    return state.oauthUrl = url;
  },
  updateConf: function updateConf(state, payload) {
    return state.conf = payload;
  },
  updateOrg: function updateOrg(state, payload) {
    return state.org = payload;
  },
  updateLicense: function updateLicense(state, payload) {
    return state.license = payload;
  },
  updateMessage: function updateMessage(state, payload) {
    if (!payload) {
      return;
    }
    if (state.message.map(function (item) {
      return item.key;
    }).indexOf(payload.key) === -1) {
      state.message = [].concat(payload, state.message);
    }
  },
  deleteMessage: function deleteMessage(state, payload) {
    state.message = state.message.filter(function (item) {
      return item.key !== payload.key;
    });
  }
};

var actions = {
  getOrg: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
      var commit = _ref.commit;
      var org;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _selection.selectionService.orgFetch();

            case 2:
              org = _context.sent;

              commit('updateOrg', org);
              return _context.abrupt('return', org);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function getOrg(_x) {
      return _ref2.apply(this, arguments);
    }

    return getOrg;
  }(),
  getConf: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
      var commit = _ref3.commit;
      var conf;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _conference.RoleCollection.getInstance().fetchInfo();

            case 2:
              conf = _context2.sent;

              commit('updateConf', conf);
              return _context2.abrupt('return', conf);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    function getConf(_x2) {
      return _ref4.apply(this, arguments);
    }

    return getConf;
  }(),
  getLicense: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {
      var commit = _ref5.commit;
      var license;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _license.LicenseModel.getInstance().fetchInfo();

            case 2:
              license = _context3.sent;

              commit('updateLicense', license);
              return _context3.abrupt('return', license);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    function getLicense(_x3) {
      return _ref6.apply(this, arguments);
    }

    return getLicense;
  }()
};

exports.default = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};