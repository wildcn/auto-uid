'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('@common/utils');

Object.defineProperty(exports, 'parseTime', {
  enumerable: true,
  get: function get() {
    return _utils.parseTime;
  }
});
Object.defineProperty(exports, 'formatTime', {
  enumerable: true,
  get: function get() {
    return _utils.formatTime;
  }
});
exports.timeAgo = timeAgo;
exports.timestampToDay = timestampToDay;
exports.numberFormatter = numberFormatter;
exports.toThousandslsFilter = toThousandslsFilter;


function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

function timeAgo(time) {
  var between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}
/* 时间戳转天 */
function timestampToDay(timestamp) {
  return Math.floor(timestamp / (1000 * 60 * 60 * 24));
}
/* 数字 格式化*/
function numberFormatter(num, digits) {
  var si = [{ value: 1E18, symbol: 'E' }, { value: 1E15, symbol: 'P' }, { value: 1E12, symbol: 'T' }, { value: 1E9, symbol: 'G' }, { value: 1E6, symbol: 'M' }, { value: 1E3, symbol: 'k' }];
  for (var i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, function (m) {
    return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');
  });
}