'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var loginByCode = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(code) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _base.baseService.login({ code: code }, {
              baseUrl: ''
            });

          case 2:
            result = _context.sent;
            return _context.abrupt('return', result);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loginByCode(_x) {
    return _ref.apply(this, arguments);
  };
}();

require('@lanxin/app-jssdk');

var _base = require('../resources/base');

var _feedback = require('@common/services/feedback');

var _feedback2 = _interopRequireDefault(_feedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(oauthUrl) {
    var _window, lx, appId, _lx$platform, isLanxinApp, isWindows, _ref3, authCode;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _window = window, lx = _window.lx, appId = _window.appId;
            _lx$platform = lx.platform, isLanxinApp = _lx$platform.isLanxinApp, isWindows = _lx$platform.isWindows;

            if (!(isLanxinApp && !isWindows)) {
              _context2.next = 19;
              break;
            }

            _context2.prev = 3;
            _context2.next = 6;
            return lx.biz.getAuthCode({ appId: appId });

          case 6:
            _ref3 = _context2.sent;
            authCode = _ref3.authCode;
            _context2.next = 10;
            return loginByCode(authCode);

          case 10:
            window.location.reload();
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2['catch'](3);

            _feedback2.default.error('获取登录信息失败');
            console.info(_context2.t0);

          case 17:
            _context2.next = 20;
            break;

          case 19:
            oauthUrl && window.location.replace(oauthUrl);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 13]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();