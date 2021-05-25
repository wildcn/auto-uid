"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 后台定义

var ADMIN_CONF = exports.ADMIN_CONF = {
  ADMIN_ADDRESS_BOOK_STATUS: {
    ENABLE: 1,
    DISABLE: 0
  },
  THIRD_APP_ENABLE: {
    ENABLE: 1,
    DISABLE: 0
  }
};

var DEFAULT_ADMIN_CONF = exports.DEFAULT_ADMIN_CONF = {
  "minPerson": 2,
  "maxPerson": 150,
  "maxImagePerson": 20,
  "defaultMaxPerson": 150,
  "defaultMaxImagePerson": 20,
  "defaultRecordFlag": 1,
  "allAllowedFlag": 0,
  "allowedRecordFlag": 0,
  "enterpriseId": '',
  "token": '',
  "openAddressBook": 0
};