"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var meetingRoomListTableOptions = exports.meetingRoomListTableOptions = {
  options: {
    column: [{ name: "会议室名称", key: "meetingName", fixed: true }, { name: "会议室编号", key: "meetingRoomId", width: '200px', fixed: true }, { name: "归属", key: "ownerName" }, { name: "归属类型", key: "ownerTypeText", width: '80px' }, { name: "最大人数", key: "maxParticipant", width: '80px' }, { name: "创建时间", key: "createTime", width: '200px', fixed: true }]
  }
};

var vodListTableOptions = exports.vodListTableOptions = {
  options: {
    column: [{ name: "录制时间", key: "displayName" }, { name: "文件大小", key: "displayFileSize" }]
  }
};

var passRecordListTableOptions = exports.passRecordListTableOptions = {
  options: {
    column: [{ name: "时间点", key: "createTime" }, { name: "姓名", key: "staffName" }, { name: "所在分支", key: "sectorName" }, { name: "动作", key: "action" }]
  }
};