'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var licenseRemindModel = function () {
  function licenseRemindModel(id) {
    _classCallCheck(this, licenseRemindModel);

    this._instance = null;
  }

  _createClass(licenseRemindModel, [{
    key: 'fetchInfo',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _api2.default.license.fetchRemind(null, { params: params });

              case 2:
                result = _context.sent;

                if (typeof result === 'string') {
                  try {
                    result = JSON.parse(result);
                  } catch (err) {
                    console.error(err);
                  }
                }

                if (!(0, _lodash.isObject)(result)) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt('return', result);

              case 8:
                return _context.abrupt('return', {});

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchInfo(_x) {
        return _ref.apply(this, arguments);
      }

      return fetchInfo;
    }()
  }, {
    key: 'modify',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _api2.default.license.setRemind(params);

              case 2:
                result = _context2.sent;
                return _context2.abrupt('return', result);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function modify(_x2) {
        return _ref2.apply(this, arguments);
      }

      return modify;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new licenseRemindModel();
      }
      return this._instance;
    }
  }]);

  return licenseRemindModel;
}();

exports.default = licenseRemindModel;