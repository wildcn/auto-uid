'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _basicLayout = require('@app/layouts/basic-layout');

var _basicLayout2 = _interopRequireDefault(_basicLayout);

var _conferenceRecord = require('@app/views/conference-record');

var _conferenceRecord2 = _interopRequireDefault(_conferenceRecord);

var _conferenceSetting = require('@app/views/conference-setting');

var _conferenceSetting2 = _interopRequireDefault(_conferenceSetting);

var _conferenceManage = require('@app/views/conference-manage');

var _conferenceManage2 = _interopRequireDefault(_conferenceManage);

var _index = require('@app/views/conference-manage/device-manage/index');

var _index2 = _interopRequireDefault(_index);

var _meetingRoom = require('@app/views/conference-manage/meeting-room');

var _meetingRoom2 = _interopRequireDefault(_meetingRoom);

var _create = require('@app/views/conference-manage/meeting-room/create');

var _create2 = _interopRequireDefault(_create);

var _modify = require('@app/views/conference-manage/meeting-room/modify');

var _modify2 = _interopRequireDefault(_modify);

var _info = require('@app/views/conference-manage/meeting-room/info');

var _info2 = _interopRequireDefault(_info);

var _conferenceSecret = require('@app/views/conference-secret');

var _conferenceSecret2 = _interopRequireDefault(_conferenceSecret);

var _mcuManage = require('@app/views/mcu-manage');

var _mcuManage2 = _interopRequireDefault(_mcuManage);

var _login = require('@app/views/login');

var _login2 = _interopRequireDefault(_login);

var _routes = require('@common/configs/routes');

var _routes2 = _interopRequireDefault(_routes);

var _abilityAuthorization = require('@app/views/ability-authorization');

var _abilityAuthorization2 = _interopRequireDefault(_abilityAuthorization);

var _info3 = require('@app/views/ability-authorization/info');

var _info4 = _interopRequireDefault(_info3);

var _jtbContact = require('@app/views/jtb-contact');

var _jtbContact2 = _interopRequireDefault(_jtbContact);

var _license = require('@app/views/license');

var _license2 = _interopRequireDefault(_license);

var _index3 = require('@app/views/license/info/index.vue');

var _index4 = _interopRequireDefault(_index3);

var _index5 = require('@app/views/license/list/index.vue');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('@app/views/license/remind/index.vue');

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Router = [{
  path: 'conference-record',
  name: 'ConferenceRecord',
  component: _conferenceRecord2.default,
  meta: {
    pageView: true,
    title: '会议记录'
  }
}, {
  path: 'conference-setting',
  name: 'ConferenceSetting',
  component: _conferenceSetting2.default,
  meta: {
    pageView: true,
    title: '会议设定'
  }
}, {
  path: '/conference-manage',
  name: 'ConferenceManage',
  redirect: {
    name: 'ConferenceManageDevice'
  },
  component: _conferenceManage2.default,
  meta: {
    pageView: true,
    title: '会议室管理'
  },
  children: [{
    path: 'device',
    name: 'ConferenceManageDevice',
    component: _index2.default,
    meta: {
      pageView: true,
      title: '设备管理'
    }
  }, {
    path: 'meeting-room',
    name: 'meetingRoom',
    component: _meetingRoom2.default,
    meta: {
      pageView: true,
      title: '云会议室'
    }
  }, {
    path: 'meeting-room/create',
    name: 'createMeetingRoom',
    component: _create2.default,
    meta: {
      pageView: true,
      title: '创建云会议室'
    }
  }, {
    path: 'meeting-room/:mid/modify',
    name: 'modifyMeetingRoom',
    component: _modify2.default,
    meta: {
      pageView: true,
      title: '修改会议室'
    }
  }, {
    path: 'meeting-room/:mid',
    name: 'meetingRoomInfo',
    component: _info2.default,
    meta: {
      pageView: true,
      title: '云会议室详情'
    }
  }]
}, {
  path: 'ability-authorization',
  name: 'AbilityAuthorization',
  component: _abilityAuthorization2.default,
  meta: {
    pageView: true,
    title: '接口授权'
  }
}, {
  path: '/license',
  name: 'license',
  component: _license2.default,
  meta: {
    pageView: true,
    title: '账户中心'
  },
  redirect: {
    name: 'LicenseInfo'
  },
  children: [{
    path: '/',
    name: 'LicenseInfo',
    component: _index4.default,
    meta: {
      pageView: true,
      title: '账户中心'
    }
  }, {
    path: 'list',
    name: 'LicenseList',
    component: _index6.default,
    meta: {
      pageView: true,
      title: '账户中心-授权记录'
    }
  }, {
    path: 'remind',
    name: 'LicenseRemind',
    component: _index8.default,
    meta: {
      pageView: true,
      title: '账户中心-授权提醒'
    }
  }]
}, {
  path: 'conference-secret',
  name: 'ConferenceSecret',
  component: _conferenceSecret2.default,
  meta: {
    pageView: true,
    title: '秘钥设定'
  }
}, {
  path: 'ability-authorization/:authId',
  name: 'AbilityAuthorizationInfo',
  component: _info4.default,
  meta: {
    pageView: true,
    title: '接口授权详情'
  }
}, {
  path: 'mcu-manage',
  name: 'MCUManage',
  component: _mcuManage2.default,
  meta: {
    pageView: true,
    title: 'MCU管理'
  }
}, {
  path: 'contact',
  name: 'JtbContact',
  component: _jtbContact2.default,
  meta: {
    pageView: true,
    title: '账号通讯录'
  }
}, {
  path: 'login',
  name: 'login',
  component: _login2.default,
  meta: {
    pageView: true,
    title: '登录'
  }
}];

var RouterList = [{
  path: '/',
  component: _basicLayout2.default,
  redirect: {
    name: 'ConferenceRecord'
  },
  children: Router
}].concat(_toConsumableArray(_routes2.default));

exports.default = RouterList;