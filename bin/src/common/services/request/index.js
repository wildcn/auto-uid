'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var request = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _transformOptions2.default)(options);

          case 3:
            options = _context.sent;
            _context.next = 6;
            return dataProvider.request(options);

          case 6:
            response = _context.sent;
            _context.next = 9;
            return (0, _errorParse2.default)(response);

          case 9:
            response = _context.sent;
            _context.next = 12;
            return (0, _responseParse2.default)(response);

          case 12:
            response = _context.sent;
            _context.next = 15;
            return (0, _bodyParse2.default)(response);

          case 15:
            response = _context.sent;
            return _context.abrupt('return', response);

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](0);

            if (!(!_context.t0.code !== 10010)) {
              _context.next = 25;
              break;
            }

            throw _context.t0;

          case 25:
            console.log('request -> err', _context.t0.code);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 19]]);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

var _dataProviderNetwork = require('@bfe/data-provider-network');

var _dataProviderNetwork2 = _interopRequireDefault(_dataProviderNetwork);

var _constants = require('@common/constants');

var _transformOptions = require('./transform-options');

var _transformOptions2 = _interopRequireDefault(_transformOptions);

var _errorParse = require('./error-parse');

var _errorParse2 = _interopRequireDefault(_errorParse);

var _responseParse = require('./response-parse');

var _responseParse2 = _interopRequireDefault(_responseParse);

var _bodyParse = require('./body-parse');

var _bodyParse2 = _interopRequireDefault(_bodyParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dataProvider = new _dataProviderNetwork2.default({
  timeout: _constants.REQUEST_TIMEOUT,
  requestIdResolver: function requestIdResolver(options) {
    return (0, _jsonStableStringify2.default)(options);
  }
});

exports.default = request;