/**
 * ====================================================================
 * ARIFULLAH PORTFOLIO - 3D CARD TILT & PARALLAX ENGINE
 * ====================================================================
 * Lightweight 60fps vanilla JS 3D tilt effect with glare reflection.
 * Automatically adapts or disables on touch devices.
 */

(function () {
  'use strict';

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  function applyTilt(element, options) {
    const maxTilt = options.max || 12;
    const perspective = options.perspective || 1000;
    const scale = options.scale || 1.03;
    const speed = options.speed || 300;

    element.style.transformStyle = 'preserve-3d';
    element.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;

    let bounds = null;

    function onMouseEnter() {
      bounds = element.getBoundingClientRect();
      element.style.transition = `transform 100ms ease-out`;
    }

    function onMouseMove(e) {
      if (!bounds) bounds = element.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      const rotateX = -yPct * maxTilt;
      const rotateY = xPct * maxTilt;

      element.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      const depthElements = element.querySelectorAll('[data-tilt-depth]');
      depthElements.forEach(el => {
        const depth = parseFloat(el.getAttribute('data-tilt-depth')) || 20;
        const tx = xPct * depth;
        const ty = yPct * depth;
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${depth}px)`;
      });
    }

    function onMouseLeave() {
      element.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      const depthElements = element.querySelectorAll('[data-tilt-depth]');
      depthElements.forEach(el => {
        el.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        el.style.transform = `translate3d(0, 0, 0)`;
      });
      bounds = null;
    }

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
  }

  function initTiltElements() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
      const max = parseFloat(el.getAttribute('data-tilt-max')) || 10;
      const scale = parseFloat(el.getAttribute('data-tilt-scale')) || 1.02;
      applyTilt(el, { max, scale });
    });
  }

  window.initTiltElements = initTiltElements;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltElements);
  } else {
    initTiltElements();
  }
})();
