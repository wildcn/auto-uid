'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
处理时间显示格式方法
 */
var transformDate = function transformDate(time) {
  var currentTime = new Date();
  var lastTime = new Date(parseInt(time));
  var dayArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  var currentYear = currentTime.getFullYear();

  var currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();

  var lastYear = lastTime.getFullYear();

  var lastMonth = lastTime.getMonth() + 1 < 10 ? '0' + (lastTime.getMonth() + 1) : lastTime.getMonth() + 1;

  var lastDate = lastTime.getDate() < 10 ? '0' + lastTime.getDate() : lastTime.getDate();

  var lastDay = lastTime.getDay();

  var lastHours = lastTime.getHours() < 10 ? '0' + lastTime.getHours() : lastTime.getHours();

  var lastMinutes = lastTime.getMinutes() < 10 ? '0' + lastTime.getMinutes() : lastTime.getMinutes();
  if (currentYear !== lastYear) {
    return lastYear + '\u5E74' + lastMonth + '\u6708' + lastDate + '\u65E5';
  }
  if (_getWeekOfYear(currentTime) !== _getWeekOfYear(lastTime)) {
    return lastMonth + '\u6708' + lastDate + '\u65E5';
  }
  if (currentDate - lastDate === 1) {
    return '昨天';
  }
  if (currentDate === lastDate) {
    return lastHours + ':' + lastMinutes;
  }
  return dayArr[lastDay - 1];
};
/*
判断当前时间是在本年的第几周
 */
var _getWeekOfYear = function _getWeekOfYear(time) {
  var today = new Date(time);
  var firstDay = new Date(today.getFullYear(), 0, 1);
  var dayOfWeek = firstDay.getDay();
  var spendDay = 1;
  if (dayOfWeek !== 0) {
    spendDay = 7 - dayOfWeek + 1;
  }
  firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
  var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
  var result = Math.ceil(d / 7);
  return result + 1;
};

exports.default = transformDate;