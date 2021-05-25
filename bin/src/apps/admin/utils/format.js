'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dateFormat = exports.dateFormat = function dateFormat(date, fmt) {
  // 毫秒转具体时间格式
  if (!fmt) {
    fmt = 'yyyy-MM-dd hh:mm:ss';
  }
  var d;
  if (date) {
    d = new Date(date);
  } else {
    d = new Date();
  }
  var o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

var formatTimeDuration = exports.formatTimeDuration = function formatTimeDuration(seconds) {
  // 秒转换时长
  var a, b, c, d, e, f, t1, t2, t3, t4;
  a = parseInt(seconds / 86400);
  b = seconds % 86400;
  c = parseInt(b / 3600);
  d = b % 3600;
  e = parseInt(d / 60);
  f = d % 60;
  t1 = f + '秒';
  t2 = e + '分' + t1;
  t3 = c + '时' + t2;
  t4 = a + '天' + t3;
  if (parseInt(seconds / 60) < 1) {
    return t1;
  } else if (parseInt(seconds / 3600) < 1) {
    return t2;
  } else if (parseInt(seconds / 86400) < 1) {
    return t3;
  } else if (parseInt(seconds / 86400) >= 1) {
    return t4;
  } else {
    return seconds;
  }
};