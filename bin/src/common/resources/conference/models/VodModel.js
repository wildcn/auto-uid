'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

var _lodash = require('lodash');

var _constants = require('../constants');

var _utils = require('@common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VodModel = function () {
  function VodModel(data) {
    _classCallCheck(this, VodModel);

    this._instance = null;
    if (!data) {
      return this;
    }
    if ((0, _lodash.isPlainObject)(data)) {
      this.init(data);
    }
  }

  _createClass(VodModel, [{
    key: 'init',
    value: function init(data) {
      this._data = (0, _lodash.cloneDeep)(data);
      Object.assign(this, data);
      this.fileSize = (0, _utils.numberFormatter)(this.fileSize || 0);
      // 持续时间
      var startTime = data.startTime,
          endTime = data.endTime;

      if (startTime && endTime) {
        this.vodTime = Math.ceil((endTime - startTime) / 1000) + 's';
      } else {
        this.vodTime = '-';
      }
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new VodModel();
      }
      return this._instance;
    }
  }]);

  return VodModel;
}();

exports.default = VodModel;