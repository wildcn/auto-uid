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

var PassRecordModel = function () {
  function PassRecordModel(data) {
    _classCallCheck(this, PassRecordModel);

    this._instance = null;
    if (!data) {
      return this;
    }
    if ((0, _lodash.isPlainObject)(data)) {
      this.init(data);
    }
  }

  _createClass(PassRecordModel, [{
    key: 'init',
    value: function init(data) {
      this._data = (0, _lodash.cloneDeep)(data);
      Object.assign(this, data);
      this.createTime = data.createTime ? (0, _utils.parseTime)(data.createTime) : '-';
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (!this._instance) {
        this._instance = new PassRecordModel();
      }
      return this._instance;
    }
  }]);

  return PassRecordModel;
}();

exports.default = PassRecordModel;