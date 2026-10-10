/**
 * js/nav.js — Mobile hamburger navigation toggle (zero-dependency, vanilla ES2020+).
 * WAI-ARIA disclosure pattern with auto-close on link tap, outside click, and Esc.
 */
(function () {
  'use strict';

  function initNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        nav.classList.add('is-open');
      } else {
        nav.classList.remove('is-open');
      }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    // Close when tapping any navigation link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        setOpen(false);
      }
    });

    // Close on outside tap
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        setOpen(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 640 && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
