'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = download;
exports.downloadUrlFile = downloadUrlFile;
function download(url) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var link = document.createElement('a');
  // fix chrmoe not carry refere issue https://bugs.chromium.org/p/chromium/issues/detail?id=455987
  link.setAttribute('referrerpolicy', 'origin');
  link.setAttribute('id', 'downloadFile');
  link.setAttribute('download', url);
  link.setAttribute('target', '_blank');
  link.setAttribute('href', url);

  Object.assign(link.style, {
    opacity: 0,
    position: 'absolute',
    top: 0
  });

  document.body.appendChild(link);
  link.click();
  setTimeout(function () {
    return document.body.removeChild(link);
  }, 1000);
}

/**
     * 获取页面文件名
     * @param url 文件url
     */
function downloadUrlFile(url) {
  url = url.replace(/\\/g, '/');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  //xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
  xhr.onload = function () {
    if (xhr.status === 200) {
      // 获取文件blob数据并保存
      var fileName = getFileName(url);
      saveAs(xhr.response, fileName);
    }
  };

  xhr.send();
}

/**
 * URL方式保存文件到本地
 * @param data 文件的blob数据
 * @param name 文件名
 */
function saveAs(data, name) {
  var urlObject = window.URL || window.webkitURL || window;
  var export_blob = new Blob([data]);
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  save_link.click();
}

/**
 * 根据文件url获取文件名
 * @param url 文件url
 */
function getFileName(url) {
  var num = url.lastIndexOf('/') + 1;
  var fileName = url.substring(num);
  //把参数和文件名分割开
  fileName = decodeURI(fileName.split("?")[0]);
  return fileName;
}