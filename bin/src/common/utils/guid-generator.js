'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 生成随机guid数
 */
function guidGenerator() {
  var S4 = function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
exports.default = guidGenerator;