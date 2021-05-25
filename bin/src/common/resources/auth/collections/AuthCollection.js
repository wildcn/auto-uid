'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthCollection = function () {
  function AuthCollection() {
    _classCallCheck(this, AuthCollection);

    this._instance = null;
  }

  _createClass(AuthCollection, [{
    key: 'fetch',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _api2.default.auth.list(params);

              case 2:
                result = _context.sent;

                if (!(0, _lodash.isObject)(result)) {
                  _context.next = 8;
                  break;
                }

                if (!(0, _lodash.isEmpty)(result.items)) {
                  result.items.forEach(function (element) {
                    element.edit = false;
                  });
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

      function fetch(_x) {
        return _ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'create',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _api2.default.auth.create(params);

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

      function create(_x2) {
        return _ref2.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'modify',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(body, params) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _api2.default.auth.modify(body, { params: params });

              case 2:
                result = _context3.sent;
                return _context3.abrupt('return', result);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function modify(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return modify;
    }()
  }, {
    key: 'reset',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(body, params) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _api2.default.auth.reset(body, { params: params });

              case 2:
                result = _context4.sent;
                return _context4.abrupt('return', result);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function reset(_x5, _x6) {
        return _ref4.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: 'delete',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _api2.default.auth.del(null, { params: params });

              case 2:
                result = _context5.sent;
                return _context5.abrupt('return', result);

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _delete(_x7) {
        return _ref5.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: 'fetchInfo',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _api2.default.auth.info(null, { params: params });

              case 2:
                result = _context6.sent;

                if (!(0, _lodash.isObject)(result)) {
                  _context6.next = 7;
                  break;
                }

                return _context6.abrupt('return', result);

              case 7:
                return _context6.abrupt('return', {});

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fetchInfo(_x8) {
        return _ref6.apply(this, arguments);
      }

      return fetchInfo;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new AuthCollection();
      }
      return this._instance;
    }
  }]);

  return AuthCollection;
}();

exports.default = AuthCollection;