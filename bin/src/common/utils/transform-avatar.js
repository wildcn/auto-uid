'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _file = require('@packages/file');

var _file2 = _interopRequireDefault(_file);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var methods = _file2.default.methods;
var batchDownload = methods.batchDownload;

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(items) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fileId';
    var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'avatarUrl';
    var defaultAvatar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var ids, avatars, indexItems, isDefaultAvatarFunction;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!from || !to)) {
              _context.next = 3;
              break;
            }

            console.warn('should set fromKey and toKey');
            return _context.abrupt('return', items);

          case 3:
            ids = (0, _lodash.compact)(items.map(function (item) {
              return item[from];
            }));
            avatars = [];

            if (!ids.length) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return batchDownload(ids);

          case 8:
            avatars = _context.sent;

          case 9:
            indexItems = {};

            if (items.length) {
              isDefaultAvatarFunction = (0, _lodash.isFunction)(defaultAvatar);

              items.forEach(function (item) {
                item[to] = isDefaultAvatarFunction ? defaultAvatar(item) : defaultAvatar;
                if (item[from]) {
                  indexItems[item[from]] = item;
                }
              });
              avatars.forEach(function (avatar) {
                indexItems[avatar.fileId][to] = avatar.downloadUrl;
              });
            }
            return _context.abrupt('return', items);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x4) {
    return _ref.apply(this, arguments);
  };
}();