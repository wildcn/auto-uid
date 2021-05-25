"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = camelCase;
function camelCase(str) {
  str = str.replace(/-(\w)/g, function ($0, $1) {
    return $1.toUpperCase();
  });
  str = str.replace(/^./, function (word) {
    return word.toUpperCase();
  });
  return str;
}