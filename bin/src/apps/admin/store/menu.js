'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _menu = require('../configs/menu');

var menuState = {
  menuData: _menu.menuData
};

var getters = {};

var mutations = {
  updateMenuData: function updateMenuData(state, menuData) {
    state.menuData = menuData;
  }
};

var actions = {};

exports.default = {
  namespaced: true,
  state: menuState,
  getters: getters,
  mutations: mutations,
  actions: actions
};