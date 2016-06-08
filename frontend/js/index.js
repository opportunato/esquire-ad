var lory = require('lory.js').lory;

function forEachSelector(selector, callback) {
  Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(callback);
}

function initSliders() {
  forEachSelector('.js_slider', function(el) {
    var slider = lory(el);
    if (el.classList.contains('index-slider')) {
      startSlideshow(el, slider);
    }
  });
}

function startSlideshow(el, slider) {
  var timeout = null;

  forEachSelector('.prev, .next', function(el) {
    el.addEventListener('click', function(e) {
      clearTimeout(timeout);
    })
  });

  function slide() {
    return setTimeout(function() {
      if (slider.returnIndex() < 1) {
        slider.next();
      } else {
        slider.prev();
      }

      timeout = slide();
    }, 5000);
  }

  timeout = slide();
}

document.addEventListener('DOMContentLoaded', function() {
  forEachSelector('.js_slider', function(el) {
    var nextButton = el.querySelector('.next');
    var prevButton = el.querySelector('.prev');
    var slidesNumber = el.querySelectorAll('li').length;

    function callback(e) {
      var slideIndex = (e.detail || { currentSlide: 0 }).currentSlide || 0;

      if (slideIndex === 0) {
        nextButton.classList.remove('hide');
        prevButton.classList.add('hide');
      } else if (slideIndex === slidesNumber - 1) {
        nextButton.classList.add('hide');
        prevButton.classList.remove('hide');
      } else {
        nextButton.classList.remove('hide');
        prevButton.classList.remove('hide');
      }
    }

    el.addEventListener('after.lory.slide', callback);
    el.addEventListener('after.lory.init', callback);
    el.addEventListener('on.lory.resize', callback);
  });

  forEachSelector('.index-slider', function(el) {
    function callback(e) {
      forEachSelector('.companies-slider li .company, .companies li .company', function(el) {
        el.classList.remove('active');
      });
      var slideIndex = (e.detail || { currentSlide: 0 }).currentSlide || 0;
      var compareIndex = Math.floor(slideIndex/2) + 1;
      var companyIndex = slideIndex % 2;
      forEachSelector('.companies li:nth-child(' + compareIndex + ') .company', function(el, index) {
        if (index === companyIndex) {
          el.classList.add('active');
        }
      });
      forEachSelector('.companies-slider li:nth-child(' + compareIndex + ') .company', function(el, index) {
        if (index === companyIndex) {
          el.classList.add('active');
        }
      });
    }

    el.addEventListener('after.lory.slide', callback);
    el.addEventListener('after.lory.init', callback);
    el.addEventListener('on.lory.resize', callback);
  });

  initSliders();

  var nextArticle = document.querySelector('.next-article');

  function animateArticle(type) {
    if (type == "right" && document.querySelector(".articles-wrapper").classList.contains("right")) return;
    if (type == "left" && !document.querySelector(".articles-wrapper").classList.contains("right")) return;

    document.querySelector(".articles-wrapper").classList.remove("static");
    setTimeout(function() {
      var method = (type == 'right') ? "add" : "remove";
      document.querySelector(".articles-wrapper").classList[method]("right");

      var switcher = document.querySelector(".switcher");
      var switcherWrapper = document.querySelector(".switcher-wrapper");
      var leftLabel = document.querySelector(".switcher-label:first-child");
      var rightLabel = document.querySelector(".switcher-label:last-child");
      var caption = document.querySelector(".switcher-caption");
      var toggle = document.querySelector(".switcher .toggle");
      var urls = {
        left: switcher.getAttribute('data-left'),
        right: switcher.getAttribute('data-right')
      }
      var otherType = (type == 'right') ? 'left' : 'right';

      caption.setAttribute('href', urls[otherType]);
      toggle.setAttribute('href', urls[otherType]);

      function createLabel(text, url) {
        var newLabel = document.createElement(url ? "a" : "div");
        newLabel.innerHTML = text;
        newLabel.classList.add("switcher-label");
        if (url) newLabel.setAttribute("href", url);
        return newLabel;
      }

      if (type == "right") {
        var newLeftLabel = createLabel(leftLabel.innerHTML, urls.left);
        var newRightLabel = createLabel(rightLabel.innerHTML);
      } else {
        var newLeftLabel = createLabel(leftLabel.innerHTML);
        var newRightLabel = createLabel(rightLabel.innerHTML, urls.right);
      }

      switcherWrapper.replaceChild(newLeftLabel, leftLabel);
      switcherWrapper.replaceChild(newRightLabel, rightLabel);

      if (window.history) {
        window.history.replaceState({}, null, urls[type]);
      }

      setTimeout(function() {
        document.querySelector(".articles-wrapper").classList.add("static");
        initSliders();
      }, 1100);
    }, 10);
    window.scrollTo(0, 446);
  }

  if (nextArticle) {
    nextArticle.querySelector('.next-button:first-child')
      .addEventListener('click', function() { animateArticle('left') });
    nextArticle.querySelector('.next-button:last-child')
      .addEventListener('click', function() { animateArticle('right') });
    nextArticle.querySelector('.center-button')
      .addEventListener('click', function() {
        if (document.querySelector(".articles-wrapper").classList.contains("right")) {
          animateArticle('left');
        } else {
          animateArticle('right');
        }
      });

    window.addEventListener('scroll', function(e) {
      var lastScrollY = window.scrollY;

      if (lastScrollY >= 446 && document.body.scrollHeight - lastScrollY - document.body.clientHeight > 300) {
        nextArticle.classList.add('show');
      } else {
        nextArticle.classList.remove('show');
      }
    });

    document.querySelector(".video").addEventListener('click', function(e) {
      e.target.innerHTML = '<iframe src="https://www.youtube.com/embed/MhIAUQO3iSI?origin=https://esquire.ru/tochka&autoplay=1" frameborder="0"></iframe>';
    })
  }

});
