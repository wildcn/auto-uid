'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function errorParse(response) {
  if (response instanceof Error) {
    if (response.message.indexOf('timeout') !== -1) {
      throw new NetworkError({ code: ErrorCodes.TIMEOUT, message: '请求超时' });
    }
    if (response instanceof TypeError) {
      throw new NetworkError({
        code: ErrorCodes.OFFLINE,
        message: '无网络连接'
      });
    }
  }

  return response;
}

exports.default = errorParse;