var lory = require('lory.js').lory;

function hasClass(el, className) {
  return el.classList.contains(className);
};

function removeClass(el, className) {
  el.classList.remove(className);
};

function addClass(el, className) {
  el.classList.add(className);
};

function toggleClass(el, className) {
  if (hasClass(el, className)) {
    removeClass(el, className);
  } else {
    addClass(el, className);
  }
}

function forEachSelector(selector, callback) {
  Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(callback);
}

document.addEventListener('DOMContentLoaded', function() {
  forEachSelector('.js_slider', function(element) {
    lory(element, {});
  });

  document.querySelector('.index-slider')
    .addEventListener('after.lory.slide', function(e) {
      forEachSelector('.companies-slider li', function(el) {
        removeClass(el, 'active');
      });
      var slideIndex = e.detail.currentSlide;
      var compareIndex = Math.ceil(slideIndex/2);
      var companyIndex = slideIndex/2;
      addClass(document.querySelector('.companies-slider li:nth-child(' + compareIndex + ') company:nth-child(' + companyIndex + ')'), 'active');
    });

  // document.querySelector(".next-button")
  //   .addEventListener('click', function(e) {
  //     toggleClass(document.querySelector(".articles-wrapper"), "right");
  //   });
});
