'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licenseCM = undefined;

var _constantManager = require('@common/services/constantManager');

var PUBLIC_MODEL = {
  OPEN: [1, '开启'],
  CLOSE: [0, '关闭']
};

var LICENSE_DEFINITION = {
  "allowedRecordFlag": PUBLIC_MODEL,
  "enforceCtrlFlag": PUBLIC_MODEL,
  "openApiFlag": PUBLIC_MODEL,
  "thirdAppEnable": PUBLIC_MODEL,
  "adminAddressBookStatus": PUBLIC_MODEL,
  "fixedMeetingRoomFlag": PUBLIC_MODEL,
  "authType": {
    AUTHORIZED: [1, '正式授权'],
    PROBATION: [2, '试用授权'],
    NOT_ACTIVED: [0, '未启用']
  },
  "authStatus": {
    CONFIRM: [1, '确认授权'],
    UN_CONFIRM: [0, '未确认']

  },
  "accountType": {
    UN_KNOWN: [0, '未知账户'],
    LANXIN: [1, '蓝信公有账户'],
    XIAOYU: [2, '自有小鱼账户']
  },
  alias: {
    maxPerson: '会议方数',
    maxPersonInfo: '会议方数',
    maxPersonValidity: '会议方数',
    maxPersonExpired: '会议方数',
    storeSpace: '存储空间',
    spaceSize: '存储空间',
    storeSpaceInfo: '存储空间',
    spaceSizeInfo: '存储空间',
    storeSpaceExpired: '存储空间',
    spaceSizeValidity: '存储空间',
    storeSpaceFull: '存储容量',
    allowedRecordFlag: '会议录像',
    enforceCtrlFlag: '强制会控',
    openApiFlag: '接口授权',
    thirdAppEnable: '接口授权',
    adminAddressBookStatus: '账号通讯录',
    maxFixedMeetingRoom: '云会议室数量',
    fixedMeetingRoomFlag: '云会议室',
    authType: '授权状态',
    accountType: '账户类型'
  }
};

var licenseCM = (0, _constantManager.create)(LICENSE_DEFINITION, 'license');
exports.default = licenseCM;
exports.licenseCM = licenseCM;