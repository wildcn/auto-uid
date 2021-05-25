'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var validateWhiteList = exports.validateWhiteList = function validateWhiteList(rule, value, callback) {
  var websiteRegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  var list = value.replace(/\n$/, '').split('\n');
  var pool = list.reduce(function (res, val) {
    return Object.assign(res, _defineProperty({}, val, 1));
  }, {});
  console.log(Object.keys(pool).length !== list.length);
  if (Object.keys(pool).length !== list.length) {
    callback(new Error('请勿输入重复的地址项！'));
  } else if (list.every(function (val) {
    return websiteRegExp.test(val);
  })) {
    callback();
  } else {
    callback(new Error('请输入合法的网址，格式包含协议://域名，例如https://example.com'));
  }
};