'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 资源大小替换
 * @param size
 * @returns {*}
 */
function formatFileSize(size) {
  var sizes = ['B', 'K', 'M', 'G', 'T'];
  if (size === 0) return '0B';
  var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  return (size / Math.pow(1024, i)).toFixed(2) + sizes[i];
}

exports.default = formatFileSize;