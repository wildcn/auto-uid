'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var setCookie = exports.setCookie = function setCookie(name, value, days, domain, path) {
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  var expires = days ? '; expires=' + date.toGMTString() : '';
  document.cookie = name + '=' + value + expires + '; path=' + path + ';domain=' + domain;
};