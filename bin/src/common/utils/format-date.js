'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function formatDate(oDate, sFormation) {
  if (!oDate) {
    return '-';
  }
  if (!(0, _lodash.isDate)(oDate)) {
    oDate = new Date(oDate);
  }
  var obj = {
    yyyyyyyy: oDate.getFullYear(),
    yy: oDate.getFullYear(),
    MM: oDate.getMonth() + 1,
    dd: oDate.getDate(),
    HH: oDate.getHours(),
    hh: oDate.getHours() % 12,
    mm: oDate.getMinutes(),
    ss: oDate.getSeconds(),
    ww: '星期' + ['日', '一', '二', '三', '四', '五', '六'][oDate.getDay()]
  };
  return sFormation.replace(/([a-z]+)/gi, function ($1) {
    return obj[$1 + $1] || ('0' + obj[$1]).slice(-2);
  });
}

exports.default = formatDate;