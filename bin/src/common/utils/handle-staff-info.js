'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleStaffInfo = exports.addStaffInfo = undefined;

var _resources = require('@common/resources');

var _resources2 = _interopRequireDefault(_resources);

var _common = require('@common/constants/common');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // TODO 其他模块使用需要修改一下通用性


/**
 * 添加staffInfo
 * @param staffs
 * @returns {Array}
 */
var addStaffInfo = function addStaffInfo(staffs) {
  var changeStaffs = [];
  staffs.forEach(function (item) {
    item.staffInfo = {};
    changeStaffs.push(item);
  });
  return changeStaffs;
};
/**
 * 添加staff信息
 * @param arr
 * @param changeStaffs
 * @param callback
 */
var _handleStaffInfos = function _handleStaffInfos(staffIdString, arr, changeStaffs, callback) {
  var len = changeStaffs.length;

  var _loop = function _loop(i) {
    if ((0, _lodash.isObject)(changeStaffs[i].staffInfo) && (0, _lodash.isEmpty)(changeStaffs[i].staffInfo)) {
      arr.forEach(function (staff) {
        if ((changeStaffs[i][staffIdString] || changeStaffs[i].data[staffIdString]) === staff.id) {
          callback(i, staff);
        }
      });
    }
  };

  for (var i = len - 1; i >= 0; i--) {
    _loop(i);
  }
};
/**
 * 批量获取staff信息
 * @param changeStaffs
 * @param callback
 * @returns {Promise<void>}
 */
var handleStaffInfo = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(staffIdString, changeStaffs, callback) {
    var currentStaffIds, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            currentStaffIds = [];

            changeStaffs.forEach(function (item) {
              var id = item[staffIdString] || item.data[staffIdString];
              if ((0, _lodash.isEmpty)(item.staffInfo) && !(0, _lodash.isEmpty)(id)) {
                currentStaffIds.push({
                  id: id,
                  type: _common.CONTACT_TYPE.STAFF
                });
              }
            });

            if ((0, _lodash.isEmpty)(currentStaffIds)) {
              _context.next = 7;
              break;
            }

            _context.next = 5;
            return _resources2.default.external.fetch({
              items: (0, _lodash.uniqBy)(currentStaffIds, 'id')
            });

          case 5:
            result = _context.sent;

            if ((0, _lodash.isArray)(result.items) && result.items.length) {
              _handleStaffInfos(staffIdString, result.items, changeStaffs, callback);
            }

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function handleStaffInfo(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.addStaffInfo = addStaffInfo;
exports.handleStaffInfo = handleStaffInfo;