var lory = require('lory.js').lory;

document.addEventListener('DOMContentLoaded', function() {
  Array.prototype.slice.call(document.querySelectorAll('.js_slider')).forEach(function (element, index) {
    lory(element, {});
  });
});
