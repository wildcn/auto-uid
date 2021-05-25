'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var menuData = [{
  path: '/conference-record',
  className: 'icon-record',
  activeClassName: 'icon-record',
  title: '会议记录'
}, {
  path: '/conference-setting',
  className: 'icon-setting',
  activeClassName: 'icon-record',
  title: '会议设定',
  // 对应授权详情里的字段 当方数为0时，该菜单不显示
  licenseControl: 'resourceStatistics.maxPersonInfo.currentAvailable'
}, {
  path: '/conference-manage',
  className: 'icon-meeting-room',
  activeClassName: 'icon-record',
  title: '会议室管理',
  licenseControl: ['fixedMeetingRoomFlag'], // 数组类型，要所有数字内开关都是true才能展示
  children: [
  // {
  //   path: '/conference-manage/device',
  //   className: 'icon-meeting-room',
  //   activeClassName: 'icon-record',
  //   title: '设备管理',
  // },
  {
    path: '/conference-manage/meeting-room',
    // className: 'icon-meeting-room',
    activeClassName: 'icon-record',
    title: '云会议室',
    licenseControl: 'fixedMeetingRoomFlag' // 对应授权中心的字段控制
  }]
}, {
  path: '/conference-secret',
  className: 'icon-authorization',
  activeClassName: 'icon-record',
  title: '秘钥设定',
  licenseControl: 'accountType' // 对应授权中心的字段控制
}, {
  path: '/contact',
  className: 'icon-contact',
  activeClassName: 'icon-record',
  title: '账号通讯录',
  licenseControl: 'adminAddressBookStatus' // 对应授权中心的字段控制
}, // 开放能力
{
  path: '/ability-authorization',
  className: 'icon-api',
  activeClassName: 'icon-record',
  title: '接口授权',
  licenseControl: 'openApiFlag' // 对应授权中心的字段控制
}, {
  path: '/license',
  className: 'icon-contact',
  activeClassName: 'icon-record',
  title: '账户中心',
  default: true // 默认未授权时，只显示default
}];

exports.menuData = menuData;