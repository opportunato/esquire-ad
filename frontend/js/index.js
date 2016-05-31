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
  forEachSelector('.js_slider', function(el) {
    var nextButton = el.querySelector('.next');
    var prevButton = el.querySelector('.prev');
    var slidesNumber = el.querySelectorAll('li').length;

    function callback(e) {
      var slideIndex = (e.detail || { currentSlide: 0 }).currentSlide || 0;

      if (slideIndex === 0) {
        removeClass(nextButton, 'hide');
        addClass(prevButton, 'hide');
      } else if (slideIndex === slidesNumber - 1) {
        addClass(nextButton, 'hide');
        removeClass(prevButton, 'hide');
      } else {
        removeClass(nextButton, 'hide');
        removeClass(prevButton, 'hide');
      }
    }

    el.addEventListener('after.lory.slide', callback);
    el.addEventListener('after.lory.init', callback);
    el.addEventListener('on.lory.resize', callback);
  });

  forEachSelector('.index-slider', function(el) {
    function callback(e) {
      forEachSelector('.companies-slider li .company, .companies li .company', function(el) {
        removeClass(el, 'active');
      });
      var slideIndex = (e.detail || { currentSlide: 0 }).currentSlide || 0;
      var compareIndex = Math.floor(slideIndex/2) + 1;
      var companyIndex = slideIndex % 2;
      forEachSelector('.companies li:nth-child(' + compareIndex + ') .company', function(el, index) {
        if (index === companyIndex) {
          addClass(el, 'active');
        }
      });
      forEachSelector('.companies-slider li:nth-child(' + compareIndex + ') .company', function(el, index) {
        if (index === companyIndex) {
          addClass(el, 'active');
        }
      });
    }

    el.addEventListener('after.lory.slide', callback);
    el.addEventListener('after.lory.init', callback);
    el.addEventListener('on.lory.resize', callback);
  });

  forEachSelector('.js_slider', function(el) {
    lory(el);
  });

  var nextArticle = document.querySelector('.next-article');

  if (nextArticle) {
    nextArticle.querySelector('.next-button:first-child')
      .addEventListener('click', function(e) {
        removeClass(document.querySelector(".articles-wrapper"), "static");
        setTimeout(function() {
          removeClass(document.querySelector(".articles-wrapper"), "right");
          setTimeout(function() {
            addClass(document.querySelector(".articles-wrapper"), "static");
          }, 1100);
        }, 10);
        window.scrollTo(0, 446);
      });
    nextArticle.querySelector('.next-button:last-child')
      .addEventListener('click', function(e) {
        removeClass(document.querySelector(".articles-wrapper"), "static");
        setTimeout(function() {
          addClass(document.querySelector(".articles-wrapper"), "right");
          setTimeout(function() {
            addClass(document.querySelector(".articles-wrapper"), "static");
          }, 1100);
        }, 10);
        window.scrollTo(0, 446);
      });

    window.addEventListener('scroll', function(e) {
      var lastScrollY = window.scrollY;

      if (lastScrollY >= 446 && document.body.scrollHeight - lastScrollY - document.body.clientHeight > 300) {
        addClass(nextArticle, 'show');
      } else {
        removeClass(nextArticle, 'show');
      }
    })
  }

});
