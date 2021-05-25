'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _admin = require('@app/configs/admin');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoleCollection = function () {
  function RoleCollection() {
    _classCallCheck(this, RoleCollection);

    this._instance = null;
  }

  _createClass(RoleCollection, [{
    key: 'fetch',


    /**
     * 获取列表
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _api2.default.role.list(params);

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

    /**
     * 创建MCU
     */

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
                return _api2.default.role.create(params);

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

    /**
     * 修改MCU
     */

  }, {
    key: 'edit',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(body, params) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _api2.default.role.edit(body, { params: params });

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

      function edit(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return edit;
    }()

    /**
     * 删除MCU
     */

  }, {
    key: 'delete',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _api2.default.role.del(null, { params: params });

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

      function _delete(_x5) {
        return _ref4.apply(this, arguments);
      }

      return _delete;
    }()
    /**
     * 获取配置信息
     */

  }, {
    key: 'fetchInfo',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _api2.default.role.info(params);

              case 2:
                result = _context5.sent;

                if (!(0, _lodash.isObject)(result)) {
                  _context5.next = 8;
                  break;
                }

                if (result.confExt) {
                  try {
                    result.confExt = JSON.parse(result.confExt);
                  } catch (err) {
                    console.log(err);
                  }
                }
                return _context5.abrupt('return', result);

              case 8:
                return _context5.abrupt('return', {});

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetchInfo(_x6) {
        return _ref5.apply(this, arguments);
      }

      return fetchInfo;
    }()

    /**
     * 修改配置信息
     */

  }, {
    key: 'modify',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(params, query) {
        var result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // 托底处理confExt格式问题
                if ((0, _lodash.isObject)(params) && params.confExt && (0, _lodash.isObject)(params.confExt)) {
                  params.confExt = JSON.stringify(params.confExt);
                }
                _context6.next = 3;
                return _api2.default.role.modifyConf(params, { params: query });

              case 3:
                result = _context6.sent;
                return _context6.abrupt('return', result);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function modify(_x7, _x8) {
        return _ref6.apply(this, arguments);
      }

      return modify;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new RoleCollection();
      }
      return this._instance;
    }
  }]);

  return RoleCollection;
}();

exports.default = RoleCollection;