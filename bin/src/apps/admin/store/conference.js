'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _conference = require('@common/resources/conference');

var _selection = require('@common/resources/selection');

var _license = require('@common/resources/license');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
  // visitor信息
  meetingRoom: {
    total: 0 // 已使用的云会议室
  }
};

var getters = {};

var mutations = {
  updateMeetingRoomCount: function updateMeetingRoomCount(state, count) {
    if ((0, _lodash.isNumber)(count) && count > 0) {
      state.meetingRoom.total = count;
    }
  }
};

var actions = {};

exports.default = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};