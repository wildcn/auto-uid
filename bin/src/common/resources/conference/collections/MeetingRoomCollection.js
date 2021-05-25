'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

var _MeetingRoomModel = require('../models/MeetingRoomModel');

var _MeetingRoomModel2 = _interopRequireDefault(_MeetingRoomModel);

var _store = require('@app/store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeetingRoomCollection = function () {
  function MeetingRoomCollection() {
    _classCallCheck(this, MeetingRoomCollection);

    this._instance = null;
  }

  _createClass(MeetingRoomCollection, [{
    key: 'fetchList',


    /**
     * 获取列表
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _api2.default.meetingRoom.list(null, { query: query });

              case 2:
                result = _context.sent;

                if (!(0, _lodash.isObject)(result)) {
                  _context.next = 8;
                  break;
                }

                if (result.total) {
                  _store2.default.commit('conference/updateMeetingRoomCount', result.total);
                }
                return _context.abrupt('return', this.transformListData(result, query));

              case 8:
                return _context.abrupt('return', {});

              case 9:
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
  }, {
    key: 'transformListData',
    value: function transformListData(res, params) {
      if (Array.isArray(res.items)) {
        res.items = res.items.map(function (item) {
          return new _MeetingRoomModel2.default(item);
        });
      }
      res.pagination = {
        total: res.total || res.items.length,
        pageSize: params.limit || 10,
        currentPage: Math.ceil((params.skip + params.limit) / params.limit)
      };
      return res;
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new MeetingRoomCollection();
      }
      return this._instance;
    }
  }]);

  return MeetingRoomCollection;
}();

exports.default = MeetingRoomCollection;