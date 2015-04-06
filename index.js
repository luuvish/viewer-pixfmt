document.onclick = function(e) {
  e.preventDefault();
  return false;
};
document.ondragover = document.ondrop = function(e) {
  e.preventDefault();
  return false;
};

var holder = document.getElementById('holder');
holder.ondragover = function () {
  this.className = 'hover';
  return false;
};
holder.ondragleave = holder.ondragend = function () {
  this.className = '';
  return false;
};
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();

  var file = e.dataTransfer.files[0];
  var path = file.path;
  var blob = file.slice(0, 704 * 480 * 3 / 2);
  var reader = new FileReader;
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) {
      var canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var CanvasPixfmtYUV = require('canvas-pixfmt').CanvasPixfmtYUV;
      var yuv = new CanvasPixfmtYUV(canvas);
      yuv.setup();
      var arrayBuffer = evt.target.result;
      var view = [
        new Uint8Array(arrayBuffer.slice(0, 704 * 480)),
        new Uint8Array(arrayBuffer.slice(704 * 480, 704 * 480 * 5 / 4)),
        new Uint8Array(arrayBuffer.slice(704 * 480 * 5 / 4, 704 * 480 * 3 / 2))
      ];
      view[0].width = 704;
      view[0].height = 480;
      view[1].width = 704 / 2;
      view[1].height = 480 / 2;
      view[2].width = 704 / 2;
      view[2].height = 480 / 2;
      yuv.fill(view);
      yuv.draw();
    }
  };
  reader.readAsArrayBuffer(blob);
  return false;
};
