'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _STATUS_TEXT, _PLAYBACK_STATUS_TEXT;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STATUS = exports.STATUS = {
  NOT_START: 1,
  PROCESSING: 2,
  END: 3
};
var STATUS_TEXT = exports.STATUS_TEXT = (_STATUS_TEXT = {}, _defineProperty(_STATUS_TEXT, STATUS.NOT_START, '预约直播'), _defineProperty(_STATUS_TEXT, STATUS.PROCESSING, '直播中'), _defineProperty(_STATUS_TEXT, STATUS.END, '回放'), _STATUS_TEXT);
var PLAYBACK_STATUS = exports.PLAYBACK_STATUS = {
  ON_THE_LINE: 1,
  OFFLINE: 2
};
var PLAYBACK_STATUS_TEXT = exports.PLAYBACK_STATUS_TEXT = (_PLAYBACK_STATUS_TEXT = {}, _defineProperty(_PLAYBACK_STATUS_TEXT, PLAYBACK_STATUS.ON_THE_LINE, '上线中'), _defineProperty(_PLAYBACK_STATUS_TEXT, PLAYBACK_STATUS.OFFLINE, '已下线'), _PLAYBACK_STATUS_TEXT);