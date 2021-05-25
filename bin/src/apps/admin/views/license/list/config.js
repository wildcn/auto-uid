"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  options: {
    column: [{ name: "操作人", key: "operatorName", width: 80, fixed: true }, { name: "导入时间", key: "createTime", width: 110, fixed: true }, { name: "授权状态", key: "authType" }, { name: "账户类型", key: "accountType" }, { name: "会议方数", key: "maxPerson", width: 80 }, { name: "方数有效期", key: "maxPersonValidity", width: 110 }, { name: "存储空间", key: "spaceSize", width: 80 }, { name: "空间有效期", key: "spaceSizeValidity", width: 110 }, { name: "会议录像", key: "allowedRecordFlag" }, { name: "强制会控", key: "enforceCtrlFlag" }, { name: "接口授权", key: "openApiFlag" }, { name: "云会议室", key: "fixedMeetingRoomFlag" }, { name: "云会议室数量", key: "maxFixedMeetingRoom" }, { name: "账号通讯录", key: "adminAddressBookStatus", width: 100 }, { name: "备注", key: "description", fixed: 'right' }],
    operation: []
  }
};