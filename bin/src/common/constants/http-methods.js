'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GET = exports.GET = 'GET';
var HEAD = exports.HEAD = 'HEAD';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';
var PATCH = exports.PATCH = 'PATCH';
var OPTIONS = exports.OPTIONS = 'OPTIONS';

// 不支持 CONNECT 和 TRACE 方法
// 实例化 Request 对象，如果方法是 CONNECT 或 TRACE，会抛出异常
// export const CONNECT = 'CONNECT';
// export const TRACE = 'TRACE';

exports.default = { GET: GET, HEAD: HEAD, POST: POST, PUT: PUT, DELETE: DELETE, OPTIONS: OPTIONS, PATCH: PATCH };