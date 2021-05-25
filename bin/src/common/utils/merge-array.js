'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeArray;

var _lodash = require('lodash');

/**
 * 数组按照指定Key进行合并
 * @param {Array} arrayA 数组A [{id:1,xxx}]
 * @param {Array} arrayB 数组B [{id:1,yyy}]
 * @param {String} key 制定的key 譬如 'id'
 */
function mergeArray(arrayA, arrayB, key) {
  if ([].concat(arrayB).length === 0) {
    return arrayA;
  }
  var map = {};
  var len = arrayA.length - 1;
  var i;
  var int = void 0;
  for (i = 0; i <= len; i++) {
    int = 'key_' + arrayA[i][key]; // 避免object根据key排序
    map[int] = arrayA[i];
  }
  arrayB.forEach(function (item) {
    if (item[key] && (0, _lodash.isPlainObject)(item)) {
      Object.assign(map['key_' + item[key]], item);
    }
  });
  return Object.values(map);
}