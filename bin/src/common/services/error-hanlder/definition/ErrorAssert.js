'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = exports.deleteAssert = exports.addAssert = exports.ErrorAssert = undefined;

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _BusinessError = require('./error/BusinessError');

var _BusinessError2 = _interopRequireDefault(_BusinessError);

var _DataProtocolError = require('./error/DataProtocolError');

var _DataProtocolError2 = _interopRequireDefault(_DataProtocolError);

var _NetworkError = require('./error/NetworkError');

var _NetworkError2 = _interopRequireDefault(_NetworkError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorAssert = {};

// 内置 assert
ErrorAssert.isBusinessError = function (error) {
  return error instanceof _BusinessError2.default;
};

ErrorAssert.isDataProtocolError = function (error) {
  return error instanceof _DataProtocolError2.default;
};

ErrorAssert.isNetworkError = function (error) {
  return error instanceof _NetworkError2.default;
};

function assert(code, error) {
  return error instanceof Error && error.code === code;
}

function addAssert(name, code) {
  var assertName = (0, _camelcase2.default)('is_' + name);
  if (ErrorAssert[assertName] === undefined) {
    ErrorAssert[assertName] = assert.bind(null, code);
  }
}

function deleteAssert(name) {
  var assertName = (0, _camelcase2.default)('is_' + name);
  delete ErrorAssert[assertName];
}

exports.ErrorAssert = ErrorAssert;
exports.addAssert = addAssert;
exports.deleteAssert = deleteAssert;

// 只是为了测试

exports.assert = assert;