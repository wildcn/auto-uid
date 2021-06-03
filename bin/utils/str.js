"use strict";

module.exports = {
  hasCapital: function hasCapital(str) {
    var result = str.match(/^.*[A-Z]+.*$/);
    if (result == null) return false;
    return true;
  }
};