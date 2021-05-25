'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var responseParse = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
    var body, contentType;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(response instanceof Response)) {
              _context.next = 44;
              break;
            }

            if (!/^5\d{2}$/.test(response.status)) {
              _context.next = 5;
              break;
            }

            throw new NetworkError({
              code: ErrorCodes.INTERNAL_ERROR,
              message: 'internal error'
            });

          case 5:
            if (!(response.status === 403)) {
              _context.next = 10;
              break;
            }

            _router2.default.push({ name: 403 });
            throw new Error('没有访问权限');

          case 10:
            if (!(response.status === 404)) {
              _context.next = 14;
              break;
            }

            throw new NetworkError({
              code: ErrorCodes.NOT_FOUND,
              message: 'not found'
            });

          case 14:
            // 解析 body
            body = null;
            contentType = response.headers.get('content-type');

            if (!(response.status === 204 || response.status === 205)) {
              _context.next = 20;
              break;
            }

            body = null;
            _context.next = 41;
            break;

          case 20:
            if (!/json/.test(contentType)) {
              _context.next = 32;
              break;
            }

            _context.prev = 21;
            _context.next = 24;
            return response.json();

          case 24:
            body = _context.sent;
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context['catch'](21);
            throw new DataProtocolError({
              code: ErrorCodes.DATA_DESERIALIZE_FAILED
            });

          case 30:
            _context.next = 41;
            break;

          case 32:
            if (!/text/.test(contentType)) {
              _context.next = 38;
              break;
            }

            _context.next = 35;
            return response.text();

          case 35:
            body = _context.sent;
            _context.next = 41;
            break;

          case 38:
            if (!/octet-stream/.test(contentType)) {
              _context.next = 41;
              break;
            }

            _context.next = 41;
            return (0, _fileExport2.default)(response);

          case 41:
            return _context.abrupt('return', body);

          case 42:
            _context.next = 45;
            break;

          case 44:
            return _context.abrupt('return', response);

          case 45:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[21, 27]]);
  }));

  return function responseParse(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _fileExport = require('@common/utils/file-export');

var _fileExport2 = _interopRequireDefault(_fileExport);

var _router = require('@app/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = responseParse;