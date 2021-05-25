'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reverseJudge = exports.judgeTrueOrFalse = undefined;

var _constants = require('@common/constants/survey/constants');

var judgeTrueOrFalse = function judgeTrueOrFalse(v) {
  if (v === _constants.ISANSWER.NO_ANSWER) {
    return false;
  } else if (v === _constants.ISANSWER.ANSWER) {
    return true;
  }
};

var reverseJudge = function reverseJudge(v) {
  if (v === false) {
    return _constants.ISANSWER.NO_ANSWER;
  } else if (v === true) {
    return _constants.ISANSWER.ANSWER;
  }
};

exports.judgeTrueOrFalse = judgeTrueOrFalse;
exports.reverseJudge = reverseJudge;