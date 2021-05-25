'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var dateFormattor = function dateFormattor(date) {
  if (!(0, _lodash.isDate)(date)) {
    date = new Date(date);
  }

  var y = date.getFullYear();
  var m = fillInZero(date.getMonth() + 1);
  var d = fillInZero(date.getDate());
  var h = fillInZero(date.getHours());
  var mi = fillInZero(date.getMinutes());
  var s = fillInZero(date.getSeconds());

  return y + '/' + m + '/' + d + ' ' + h + ':' + mi + ':' + s;
};

var fillInZero = function fillInZero(n) {
  if (n < 10) {
    n = '0' + n;
  }
  return n;
};

exports.default = dateFormattor;