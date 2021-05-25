'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 获取图片反色
 */
var getImgReversedPhase = exports.getImgReversedPhase = function getImgReversedPhase(src) {
  var revertColor = void 0; // 反色
  return new Promise(function (resolve, reject) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      var width = img.width,
          height = img.height;

      var scaleRect = width * height;
      var sumR = 0;
      var sumG = 0;
      var sumB = 0;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < imgData.data.length; i += 4) {
        var r = imgData.data[i];
        var g = imgData.data[i + 1];
        var b = imgData.data[i + 2];
        sumR += r;
        sumG += g;
        sumB += b;
      }
      var avgR = Math.round(sumR / scaleRect);
      var dvgG = Math.round(sumG / scaleRect);
      var avgB = Math.round(sumB / scaleRect);
      var rgbColor = getRevertColor(avgR, dvgG, avgB);
      revertColor = rgb2hex(rgbColor);
      resolve(revertColor);
    };
    img.onerror = function (err) {
      return reject(err);
    };
    img.src = src;
  });
};

function getRevertColor(r, g, b) {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b
  };
}
var rgb2hex = exports.rgb2hex = function rgb2hex(rgb) {
  var r = rgb.r,
      g = rgb.g,
      b = rgb.b;

  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
var rgb2hsv = exports.rgb2hsv = function rgb2hsv(color) {
  if (color.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) === null) {
    // throw "rgb2hsv: wrong color input. \n Hex color like '#fa4839' or 'fa4839' expected";
    return false;
  }
  if (color.indexOf('#') !== -1) {
    color = color.split('#')[1];
  }
  var r = parseInt(color[0] + color[1], 16) / 255;
  var g = parseInt(color[2] + color[3], 16) / 255;
  var b = parseInt(color[4] + color[5], 16) / 255;

  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);

  var h, s, v;
  if (min === max) h = 0;
  if (max === r && g >= b) h = 60 * (g - b) / (max - min);
  if (max === r && g < b) h = 60 * (g - b) / (max - min) + 360;
  if (max === g) h = 60 * (b - r) / (max - min) + 120;
  if (max === b) h = 60 * (r - g) / (max - min) + 240;

  s = 1 - min / max;
  if (max === 0) s = 0;
  s *= 100;
  v = max;
  v *= 100;
  return [Math.round(h), Math.round(s), Math.round(v)];
};

var hsv2rgb = exports.hsv2rgb = function hsv2rgb(h, s, v) {
  if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) {
    // throw 'hsv2rgb: wrong color input. \n H = [0..360], S = [0..100], V = [0..100] expected';
    return false;
  }
  var Hi = Math.round(h / 60);
  var Vmin = (100 - s) * v / 100;
  var a = (v - Vmin) * (h % 60) / 60;
  var Vinc = Vmin + a;
  var Vdec = v - a;
  var r = 0;
  var g = 0;
  var b = 0;
  switch (Hi) {
    case 0:
      r = v;
      g = Vinc;
      b = Vmin;
      break;
    case 1:
      r = Vdec;
      g = v;
      b = Vmin;
      break;
    case 2:
      r = Vmin;
      g = v;
      b = Vinc;
      break;
    case 3:
      r = Vmin;
      g = Vdec;
      b = v;
      break;
    case 4:
      r = Vinc;
      g = Vmin;
      b = v;
      break;
    case 5:
      r = v;
      g = Vmin;
      b = Vdec;
  }
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return '#' + r.toString(16) + g.toString(16) + b.toString(16);
};