'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 全局提醒的文案
var LICENSE_MESSAGE = exports.LICENSE_MESSAGE = {
  PROBATION: {
    key: 'licenseProbation',
    message: '当前组织视频会议功能为试用状态，请联系销售获取授权文件，开通正式视频会议功能'
  },
  EXPIRE: {
    key: 'licenseExpire',
    message: '有部分业务授权即将到期，请到账户中心查看，如已充值请忽略'
  },
  MISSING_SECRET: {
    key: 'missingSecret',
    message: '请在秘钥设定页面，填写秘钥信息'
  },
  NOT_ACTIVED: {
    key: 'licenseNotActived',
    message: '当前视频会议未启用，请导出“预授权文件”，并联系蓝信相关人员开通视频会议功能'
  }
};

var LICENSE_OPTIONS = exports.LICENSE_OPTIONS = {
  // 授权即将在以下时间到期，将会强制提醒
  MESSAGE_EXPIRED_TIME: 1000 * 60 * 60 * 24 * 7
};