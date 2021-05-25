'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var service = {
  info: function info(payload) {
    return _api2.default.contact.info(payload);
  },
  sectorsFetch: function sectorsFetch(payload) {
    return _api2.default.contact.sectorsFetch(payload);
  },
  staffsFetch: function staffsFetch(payload) {
    return _api2.default.contact.staffsFetch(payload);
  },
  staffsSearch: function staffsSearch(payload) {
    return _api2.default.contact.staffsSearch(payload);
  },
  orgFetch: function orgFetch(payload) {
    return _api2.default.contact.orgFetch(payload);
  }
};

exports.default = service;