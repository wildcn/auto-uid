'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.meetingRoomCM = undefined;

var _ownerType;

var _constantManager = require('@common/services/constantManager');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var METTING_ROOM_CONSTANTS = {
  ownerType: (_ownerType = {
    SECTOR: [0, '公共']
  }, _defineProperty(_ownerType, 'SECTOR', [2, '分支']), _defineProperty(_ownerType, 'STAFF', [1, '个人']), _ownerType),
  passAction: {
    ENTER: [1, '进入会议室'],
    OUT: [0, '离开会议室']
  },
  alias: {
    meetingName: '会议名称',
    meetingNumber: '会议号码',
    maxParticipant: '最大成员数',
    ownerId: '归属者ID',
    ownerName: '归属者名称',
    ownerType: '归属者类型',
    ctime: '创建时间',
    confPassword: '入会密码',
    controlPassword: '主持密码'
  }
};

var meetingRoomCM = exports.meetingRoomCM = (0, _constantManager.create)(METTING_ROOM_CONSTANTS, 'license');