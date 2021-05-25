'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var validators = {
  deviceNum: function deviceNum(rule, value, callback) {
    // 设备编号校验
    if ((0, _lodash.isNil)(value) || (0, _lodash.isEmpty)(value)) {
      callback(new Error('请输入设备编号'));
    }
    var num = Number(value);
    if (!Number.isInteger(num)) {
      callback(new Error('请输入数字值'));
    } else {
      callback();
    }
  },
  meetingRoomName: function meetingRoomName(rule, value, callback) {
    // 会议室名称校验
    var pattern = /^([\u4e00-\u9fa5a-zA-Z\d-\_]{0,20})$/;
    if ((0, _lodash.isNil)(value) || (0, _lodash.isEmpty)(value)) {
      callback(new Error('请输入会议室名称'));
    } else if (!pattern.test(value)) {
      callback(new Error('仅支持中文、英文大小写、数字、中划线、下划线组合'));
    }
    callback();
  },
  sixDigitIntPassword: function sixDigitIntPassword(rule, value, callback) {
    if (/^\d{6}$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入6位数字密码'));
    }
  },
  limitIntValidator: function limitIntValidator(max) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    return function (rule, value, callback) {
      if (!(0, _lodash.isNumber)(+value)) {
        callback(new Error('请输入有效的数字'));
      } else if (+value < min) {
        callback(new Error('超出最小范围限制'));
      } else if (+value > max) {
        callback(new Error('超出最大范围限制'));
      } else {
        callback();
      }
    };
  },
  mcuName: function mcuName(rule, value, callback) {
    var pattern = /^([\u4e00-\u9fa5a-zA-Z\d-\_]{0,20})$/;
    if ((0, _lodash.isNil)(value) || (0, _lodash.isEmpty)(value)) {
      callback(new Error('请输入MCU名称'));
    } else if (!pattern.test(value)) {
      callback(new Error('仅支持中文、英文大小写、数字、中划线、下划线组合'));
    }
    callback();
  },
  ip: function ip(rule, value, callback) {
    // IP地址验证
    var IPReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!value) {
      callback(new Error('请输入设备IP'));
    }
    if (!IPReg.test(value)) {
      callback(new Error('请输入有效IP'));
    }
    callback();
  },
  port: function port(rule, value, callback) {
    // 端口验证
    var port = Number(value);
    if (!value) {
      callback(new Error('请输入设备端口'));
    }
    if (!Number.isInteger(port)) {
      callback(new Error('请输入0～65535的正整数'));
    } else {
      if (port < 0 && port > 65535) {
        callback(new Error('请输入0～65535的正整数'));
      }
      callback();
    }
  }
};

exports.default = validators;