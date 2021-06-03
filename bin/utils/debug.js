"use strict";

var chalk = require("chalk");

var ERROR = chalk.bold.red;
var SUCCESS = chalk.greenBright;
var INFO = chalk.bold.blue;
var WARNING = chalk.keyword("orange");

module.exports = {
  logSuc: function logSuc() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return console.log(SUCCESS("[auto-uid]"), args.join(" "));
  },
  logErr: function logErr() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return console.log(ERROR("[auto-uid]"), args.join(" "));
  },
  logWar: function logWar() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return console.log(WARNING("[auto-uid]"), args.join(" "));
  },
  logInfo: function logInfo() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return console.log(INFO("[auto-uid]"), args.join(" "));
  }
};