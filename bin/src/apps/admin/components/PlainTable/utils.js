'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alwaysComponent = alwaysComponent;

var _lodash = require('lodash');

var _elementUi = require('element-ui');

var _elementUi2 = _interopRequireDefault(_elementUi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 将参数转换成vue自定义组件
 */
function alwaysComponent(data) {
  if ((0, _lodash.isArray)(data)) {
    data = data.map(function (item) {
      return alwaysComponent(item);
    });
    return data;
  }
  if ((0, _lodash.isString)(data) || (0, _lodash.isNumber)(data)) {
    return data;
  }
  if ((0, _lodash.isPlainObject)(data)) {
    if (data.render) {
      // 传入自定义VUE组件
      return data;
    } else {
      return returnVNode(data);
    }
  }

  function returnVNode(_ref) {
    var element = _ref.element,
        content = _ref.content,
        option = _ref.option;

    return {
      name: 'TableCoumn_' + content,
      render: function render(createElement) {
        // 指定元素
        element = _elementUi2.default[element] || 'span';
        content = content || '';
        option = option || {};
        var that = this;
        option.on = {
          click: function click() {
            return that.$emit('action', data);
          },
          change: function change() {
            return that.$emit('action', data);
          }
        };
        return createElement(element, option, content);
      }
    };
  }
}