"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleStream;
function handleStream(readableStream) {
  var reader = readableStream.getReader();
  var chunks = [];

  function pump() {
    return reader.read().then(function (_ref) {
      var value = _ref.value,
          done = _ref.done;

      if (done) {
        return chunks;
      }
      chunks.push(value);
      return pump();
    });
  }
  return pump();
}