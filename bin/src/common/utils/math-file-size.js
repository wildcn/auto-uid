'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mathFileSize;
//  格式化文件大小
function mathFileSize(value) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (value === null || value === '') {
    return '0 Bytes';
  }
  var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  var size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  size = size.toFixed(2);
  if (size > 1000) {
    return mathFileSize(size, ++index);
  }

  return size + unitArr[index];
}