"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* istanbul ignore next */
var DataProtocolError = function (_Error) {
  _inherits(DataProtocolError, _Error);

  function DataProtocolError(_ref) {
    var code = _ref.code,
        message = _ref.message;

    _classCallCheck(this, DataProtocolError);

    var _this = _possibleConstructorReturn(this, (DataProtocolError.__proto__ || Object.getPrototypeOf(DataProtocolError)).call(this, message));

    _this.code = code;
    return _this;
  }

  return DataProtocolError;
}(Error);

exports.default = DataProtocolError;