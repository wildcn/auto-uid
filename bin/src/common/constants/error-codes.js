'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ERROR_CODES = exports.ERROR_CODES = {
  TIMEOUT: '服务超时',
  OFFLINE: '无网络连接',
  NOT_FOUND: '无此服务',
  INTERNAL_ERROR: '服务内部错误',
  DATA_DESERIALIZE_FAILED: 'data_deserialize_failed',
  DATA_SERIALIZE_FAILED: 'data_serialize_failed',

  UNAUTHORIZED: 10010, // 没有登录
  PERMISSION_DENIED: 10015, // 没有权限
  INVALID_REQ_PARAM: 10005 // 请求参数出错
};

exports.default = ERROR_CODES;