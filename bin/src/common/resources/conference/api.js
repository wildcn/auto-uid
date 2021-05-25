'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('@common/services/request');

var _request2 = _interopRequireDefault(_request);

var _generateHttpResources = require('@common/utils/generate-http-resources');

var _generateHttpResources2 = _interopRequireDefault(_generateHttpResources);

var _constants = require('@common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var record = {
  // 会议记录
  list: {
    url: 'meetingrecord/list',
    method: 'GET'
  },
  info: {
    url: 'meetingrecord/:rId',
    method: 'GET'
  },
  export: {
    url: 'meetingrecord/export',
    method: 'GET'
  }

};

var vod = {
  list: {
    url: 'vods/:mid',
    method: "GET"
  }
};

var role = {
  // 会议设定
  info: {
    url: 'conf/admin',
    method: 'GET'
  },
  initInfo: {
    url: 'conf',
    method: 'POST'
  },
  modifyConf: {
    url: 'conf/:orgId',
    method: 'PUT'
  },
  list: {
    url: 'meetingrole/list',
    method: 'GET'
  },
  create: {
    url: 'meetingrole/add',
    method: 'POST'
  },
  edit: {
    url: 'meetingrole/:rId',
    method: 'POST'
  },
  del: {
    url: 'meetingrole/delete/:rId',
    method: 'PUT'
  }
};

var manage = {
  // 会议室管理
  list: {
    url: 'meetingdevice/list',
    method: 'GET'
  },
  create: {
    url: 'meetingdevice/add',
    method: 'POST'
  },
  edit: {
    url: 'meetingdevice/:dId',
    method: 'POST'
  },
  del: {
    url: 'meetingdevice/delete/:dId',
    method: 'PUT'
  }
};

var mcu = {
  // MCU管理
  list: {
    url: 'mcu/list',
    method: 'GET'
  },
  create: {
    url: 'mcu/add',
    method: 'POST'
  },
  edit: {
    url: 'mcu/:mId',
    method: 'POST'
  },
  del: {
    url: 'mcu/delete/:mId',
    method: 'PUT'
  }
};

var meetingRoom = {
  create: {
    url: '/meetingroom/create',
    method: 'POST'
  },
  modify: {
    url: '/meetingroom/:mid/modify',
    method: 'PUT'
  },
  delete: {
    url: '/meetingroom/:mid/delete',
    method: 'DELETE'
  },
  list: {
    url: '/meetingroom/list',
    method: 'GET'
  },
  info: {
    url: '/meetingroom/:mid/fetch',
    method: 'GET'
  },
  recordList: {
    url: '/meetingroom/:mid/record/list',
    method: 'GET'
  },
  exportRecordList: {
    url: '/meetingroom/:mid/record/export',
    method: 'GET'
  }
};

// 调用mock数据
if (__ENV__) {
  // Object.keys(meetingRoom).forEach(item => {
  //   meetingRoom[item].url = MOCK_API_PERFIX + meetingRoom[item].url;
  // })

}

var api = (0, _generateHttpResources2.default)({ record: record, vod: vod, meetingRoom: meetingRoom, role: role, manage: manage, mcu: mcu }, _request2.default);

exports.default = api;