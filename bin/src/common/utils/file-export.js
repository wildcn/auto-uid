'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultName = '文件.xlsx';
/**
 * 文件导出
 * response 文件二进制数据
 */
var fileExport = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
    var name, data, url, link;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = getFileName(response.headers.get('content-disposition'));
            _context.next = 3;
            return handleStream(response.body);

          case 3:
            data = _context.sent;
            url = window.URL.createObjectURL(new Blob(data));
            link = document.createElement('a');

            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fileExport(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * 文件名字解析
 * dis
 */
var getFileName = function getFileName(dis) {
  var filename = '';
  var disposition = decodeURIComponent(dis);
  if (disposition && disposition.indexOf('attachment') !== -1) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  if ((0, _lodash.isEmpty)(filename)) {
    return defaultName;
  } else {
    return filename;
  }
};
/**
 * 文件流解析
 */
var handleStream = function handleStream(readableStream) {
  var reader = readableStream.getReader();
  var chunks = [];

  function pump() {
    return reader.read().then(function (_ref2) {
      var value = _ref2.value,
          done = _ref2.done;

      if (done) {
        return chunks;
      }
      chunks.push(value);
      return pump();
    });
  }
  return pump();
};

exports.default = fileExport;