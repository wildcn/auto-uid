'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

var _VodModel = require('../models/VodModel');

var _VodModel2 = _interopRequireDefault(_VodModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VodCollection = function () {
  function VodCollection() {
    _classCallCheck(this, VodCollection);

    this._instance = null;
  }

  _createClass(VodCollection, [{
    key: 'fetchList',


    /**
     * 获取会议录像
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _api2.default.vod.list(null, { params: params });

              case 2:
                result = _context.sent;

                if (!(0, _lodash.isObject)(result)) {
                  _context.next = 9;
                  break;
                }

                if ((0, _lodash.isObject)(result) && Array.isArray(result.items)) {
                  result.items = result.items.map(function (item) {
                    return new _VodModel2.default(item);
                  });
                } else {
                  result.items = [];
                }
                result.pagination = {
                  total: result.total || result.items.length,
                  pageSize: params.limit || 10,
                  currentPage: Math.ceil((params.skip + params.limit) / params.limit)
                };
                return _context.abrupt('return', result);

              case 9:
                return _context.abrupt('return', {});

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchList(_x) {
        return _ref.apply(this, arguments);
      }

      return fetchList;
    }()
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new VodCollection();
      }
      return this._instance;
    }
  }]);

  return VodCollection;
}();

exports.default = VodCollection;