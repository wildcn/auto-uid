'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCardsOptions = undefined;

var _license = require('@common/resources/license');

var _router = require('@app/router');

var _router2 = _interopRequireDefault(_router);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 卡片授权修改的弹窗校验
var validator = function validator(max) {
  return function (rule, value, callback) {
    if (!value) {
      callback('设置不能为空，如无需修改请点击取消！');
    }
    if (!(0, _lodash.isNumber)(+value)) {
      callback(new Error('配置仅支持数字！'));
    } else if (+value > +max) {
      callback(new Error('配置超出最大限制，请修改！'));
    } else if (+value <= 0) {
      callback(new Error('配置超出最小限制，请修改！'));
    } else {
      callback();
    }
  };
};

var routerPushLicenseList = function routerPushLicenseList(filterKeys) {
  return function (filterKeys) {
    _router2.default.push({
      name: 'LicenseList',
      params: {
        filterKeys: filterKeys
      }
    });
  };
};

/**
 * 生成预制卡片的dom数据
 * @data license/statistic/fetch返回的数据
 * -- RETURN --
 * @key 数据在、statistic/fetch中对应的字段
 * @changeType 修改弹窗内的表单类型 input switch
 * @tips 右上角hover的提示
 * @confKey 对应admin/conf 组织配置表里的字段
 * @content Array 页卡中心的内容
 * @control 页面下方的控制按钮
 */

var getCardsOptions = exports.getCardsOptions = function getCardsOptions(data, ctx) {
  var payload = (0, _lodash.cloneDeep)(data);
  // 小鱼账户
  var isXiaoYuAccountType = payload.accountType === _license.licenseCM.accountType.XIAOYU;
  if (!payload || !payload.resourceStatistics) {
    return {};
  }
  var primaryCardsOption = {
    maxPersonInfo: {
      key: 'maxPersonInfo',
      confKey: 'defaultMaxPerson', // 不同接口的字段不一样 
      name: '会议方数',
      changeType: 'input',
      unit: '方',
      tips: '会议方数为当前组织可配置的单场会议最大会议人数，具体人数限制可在”会议设定“页面进行设定',
      inputTips: '请不要超过购买的最大方数，否则超方人员将无法入会',
      inputPlaceholder: '请输入购买的会议方数',
      control: [{
        text: '查看详情', method: function method() {
          return _router2.default.push({
            name: 'LicenseList',
            params: {
              filterKeys: 'maxPerson'
            }
          });
        }
      }],
      rules: {
        maxPersonInfo: [{
          validator: validator(9999),
          trigger: true
        }]
      }
    },
    spaceSizeInfo: {
      key: 'spaceSizeInfo',
      confKey: 'spaceSize', // 不同接口的字段不一样 
      name: '存储空间',
      changeType: 'input',
      unit: "GB",
      tips: '存储空间用于存储企业会议录像数据，空间用完将无法使用会议录像功能',
      inputTips: '请不要超过购买的最大空间，否则超出后录像无法生成',
      inputPlaceholder: '请输入购买的存储空间',
      control: [{
        text: '查看详情', method: function method() {
          return _router2.default.push({
            name: 'LicenseList',
            params: {
              filterKeys: 'spaceSize'
            }
          });
        }
      }],
      rules: {
        spaceSizeInfo: [{
          validator: validator(99999),
          trigger: true
        }]
      }
    },
    maxFixedMeetingRoom: {
      key: 'maxFixedMeetingRoom',
      confKey: 'maxFixedMeetingRoom',
      name: '云会议室数量',
      unit: '个',
      tips: '展示当前组织可开通的云会议室数量',
      changeType: 'input',
      inputTips: '请不要填写超过从小鱼处购买的云会议室数量',
      control: []
    }
  };
  var flagCardsOption = [{
    key: 'allowedRecordFlag',
    name: '会议录像',
    tips: '指当前组织是否可以使用会议录像功能，具体功能控制可在”会议设定“页面进行设定'
  }, {
    key: 'enforceCtrlFlag',
    name: '强制会控',
    tips: '指当前组织是否可以使用强制会控功能，具体功能控制可在”会议设定“页面进行设定'
  }, {
    key: 'openApiFlag',
    name: '接口授权',
    tips: '指当前组织是否可以视频会议接口授权供第三方调用'
  }, {
    key: 'adminAddressBookStatus',
    name: '账号通讯录',
    tips: '指开放展示组织用户对应的小鱼账号，需要对接定制版客户端'
  }, {
    key: 'fixedMeetingRoomFlag',
    name: '云会议室',
    tips: '创建固定会议号的云会议室功能'
  }, {
    key: 'accountType',
    name: '账户类型'
  }];
  // 处理content和control
  flagCardsOption.forEach(function (item) {
    var key = item.key;
    // 用户卡片组件的内容展示，支持多行
    item.content = [_license.licenseCM[key].getDescByValue(payload[key])];
    if (isXiaoYuAccountType && item.control) {
      item.control = [{
        text: '设置', method: function method() {
          ctx.flagSetting(item);
        }
      }];
    }
  });

  // 转换成key:value格式
  var response = flagCardsOption.reduce(function (result, next) {
    if (!(0, _lodash.isUndefined)(payload[next.key])) {
      Object.assign(result, _defineProperty({}, next.key, next));
    }
    return result;
  }, primaryCardsOption);
  // 页卡排序

  return response;
};