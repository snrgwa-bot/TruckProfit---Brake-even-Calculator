/* TruckProfit site — scroll reveals, nav state, counters, screenshot scrollytelling */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  // Nav background on scroll
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on enter
  var revealables = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  // Count-up numbers (data-count="847.20" data-prefix="$")
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-decimals') | 0);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    var start = performance.now(), dur = 1400;
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  // Screenshot scrollytelling: each .story-step activates its matching .story-shot
  var steps = document.querySelectorAll('.story-step');
  var shots = document.querySelectorAll('.story-shot');
  if (steps.length && shots.length && 'IntersectionObserver' in window) {
    var activate = function (name) {
      shots.forEach(function (s) { s.classList.toggle('active', s.dataset.shot === name); });
      steps.forEach(function (s) { s.classList.toggle('active', s.dataset.step === name); });
    };
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(en.target.dataset.step);
      });
    }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });
    steps.forEach(function (s) { sio.observe(s); });
    steps.forEach(function (s) {
      s.addEventListener('click', function () { activate(s.dataset.step); });
    });
  }

  // FAQ accordions
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var open = item.classList.contains('open');
      item.classList.toggle('open', !open);
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  // Current year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
