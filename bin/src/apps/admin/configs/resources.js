'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  record: {
    // 会议记录
    fetchBelongList: {
      url: 'api/v1/meetingrecord',
      method: 'GET'
    },
    fetchInfo: {
      url: 'api/v1/meetingrecord/rId',
      method: 'GET'
    },
    download: {
      //  未提供导出接口
      url: '',
      method: 'GET'
    }
  },
  role: {
    fetchRoleList: {
      url: 'api/v1/meetingrolelist',
      method: 'GET'
    },
    add: {
      url: 'api/v1/meetingrole/add',
      method: 'POST'
    },
    edit: {
      url: 'api/v1/meetingrole/:rId',
      method: 'POST'
    },
    del: {
      url: 'api/v1/meetingrole/delete/:rId',
      method: 'PUT'
    }
  },
  manage: {
    // 会议室管理
    fetchBelongList: {
      url: 'api/v1/meetingdevicelist',
      method: 'GET'
    },
    create: {
      url: 'api/v1/meetingdevice/add',
      method: 'POST'
    },
    edit: {
      url: 'api/v1/meetingdevice/:dId',
      method: 'POST'
    },
    del: {
      url: 'api/v1/meetingdevice/delete/:dId',
      method: 'PUT'
    }
  },
  mcu: {
    // MCU管理
    fetchBelongList: {
      url: 'api/v1/mculist',
      method: 'GET'
    },
    create: {
      url: 'api/v1/mcu/add',
      method: 'POST'
    },
    edit: {
      url: 'api/v1/mcu/:mId',
      method: 'POST'
    },
    del: {
      url: 'api/v1/meetingdevice/delete/:mId',
      method: 'PUT'
    }
  },
  auth: {
    // 授权管理
    create: {
      url: 'api/v1/auth/create',
      method: 'POST'
    },
    modify: {
      url: 'api/v1/auth/modify',
      method: 'POST'
    },
    delete: {
      url: 'api/v1/auth/delete',
      method: 'POST'
    },
    reset: {
      url: 'api/v1/auth/reset',
      method: 'POST'
    },
    token: {
      url: 'api/v1/auth/token',
      method: 'POST'
    },
    list: {
      url: 'api/v1/auth/list',
      method: 'GET'
    },
    id: {
      url: 'api/v1/auth/:auth_id',
      method: 'GET'
    }
  },
  license: {
    fetchRemind: {
      url: '/liicense/remind/fetch',
      method: 'GET'
    },
    setRemind: {
      url: '/license/remind/set',
      method: 'POST'
    },
    info: {
      url: '/license/statistic/fetch'
    },
    list: {
      url: '/license/list'
    },
    confirm: {
      url: '/license/confirm',
      method: 'POST'
    },
    upload: {
      url: '/license/upload',
      method: 'POST'
    },
    create: {
      url: '/license/precreate'
    }
  }
};