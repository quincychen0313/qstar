(() => {
  'use strict';

  if (window.__QSTAR_CURSOR_V4__) return;
  window.__QSTAR_CURSOR_V4__ = true;

  const ACTION_SELECTOR = 'a, button, input, textarea, select, summary, [role="button"], [tabindex]:not([tabindex="-1"])';
  const state = {
    active: false,
    visible: false,
    targetX: -120,
    targetY: -120,
    renderX: -120,
    renderY: -120,
    lastTrailX: -120,
    lastTrailY: -120,
    lastTrailTime: 0,
  };

  let cursor;
  let rafId = 0;

  const isDark = () => document.documentElement.classList.contains('dark');

  const buildCursor = () => {
    cursor = document.createElement('div');
    cursor.id = 'qstar-theme-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
      <div class="qstar-pointer-star">
        <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
          <circle class="qstar-star-orbit" cx="24" cy="24" r="17.5"></circle>
          <path class="qstar-star-main" d="M24 1C26.2 15.3 29.1 19.1 47 24C29.1 28.9 26.2 32.7 24 47C21.8 32.7 18.9 28.9 1 24C18.9 19.1 21.8 15.3 24 1Z"></path>
          <circle class="qstar-star-core" cx="24" cy="24" r="2.8"></circle>
        </svg>
      </div>
      <div class="qstar-pointer-sun">
        <span class="qstar-sun-ray"></span>
        <span class="qstar-sun-ray"></span>
        <span class="qstar-sun-ray"></span>
        <span class="qstar-sun-ray"></span>
        <span class="qstar-sun-core"></span>
      </div>`;
    document.body.appendChild(cursor);
  };

  const buildOpeningFlash = () => {
    const flash = document.createElement('div');
    flash.id = 'qstar-opening-flash';
    flash.setAttribute('aria-hidden', 'true');
    flash.innerHTML = `
      <span class="qstar-opening-halo"></span>
      <span class="qstar-opening-line qstar-h"></span>
      <span class="qstar-opening-line qstar-v"></span>
      <span class="qstar-opening-line qstar-d1"></span>
      <span class="qstar-opening-line qstar-d2"></span>
      <span class="qstar-opening-ring"></span>
      <span class="qstar-opening-core"></span>`;
    document.body.appendChild(flash);
    window.setTimeout(() => flash.remove(), 1400);
  };

  const setCursorPosition = (x, y) => {
    if (!cursor) return;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const activate = (x, y) => {
    if (!state.active) {
      state.active = true;
      state.targetX = state.renderX = state.lastTrailX = x;
      state.targetY = state.renderY = state.lastTrailY = y;
      document.documentElement.classList.add('qstar-cursor-enabled');
      setCursorPosition(x, y);
    }
    state.visible = true;
    cursor?.classList.add('qstar-cursor-visible');
  };

  const createTrail = (x, y, now) => {
    if (!isDark() || now - state.lastTrailTime < 32) return;
    const dx = x - state.lastTrailX;
    const dy = y - state.lastTrailY;
    if (Math.hypot(dx, dy) < 9) return;

    state.lastTrailX = x;
    state.lastTrailY = y;
    state.lastTrailTime = now;

    const star = document.createElement('span');
    star.className = 'qstar-cursor-trail';
    const size = 2.5 + Math.random() * 4.5;
    star.style.setProperty('--qstar-trail-x', `${x + (Math.random() - .5) * 7}px`);
    star.style.setProperty('--qstar-trail-y', `${y + (Math.random() - .5) * 7}px`);
    star.style.setProperty('--qstar-trail-size', `${size}px`);
    document.body.appendChild(star);
    window.setTimeout(() => star.remove(), 680);
  };

  const onMove = (event) => {
    if ('pointerType' in event && event.pointerType === 'touch') return;
    activate(event.clientX, event.clientY);
    state.targetX = event.clientX;
    state.targetY = event.clientY;

    // Light mode: no interpolation and therefore no intentional delay.
    if (!isDark()) {
      state.renderX = event.clientX;
      state.renderY = event.clientY;
      setCursorPosition(event.clientX, event.clientY);
    }

    const target = event.target instanceof Element ? event.target.closest(ACTION_SELECTOR) : null;
    cursor?.classList.toggle('qstar-cursor-over-action', Boolean(target));
  };

  const animate = (now) => {
    if (state.active && isDark()) {
      // Dark mode: smooth delayed drag.
      const ease = 0.115;
      state.renderX += (state.targetX - state.renderX) * ease;
      state.renderY += (state.targetY - state.renderY) * ease;
      setCursorPosition(state.renderX, state.renderY);
      if (state.visible) createTrail(state.renderX, state.renderY, now);
    }
    rafId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    buildCursor();
    buildOpeningFlash();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', () => cursor?.classList.add('qstar-cursor-down'), { passive: true });
    window.addEventListener('pointerup', () => cursor?.classList.remove('qstar-cursor-down'), { passive: true });
    window.addEventListener('mousedown', () => cursor?.classList.add('qstar-cursor-down'), { passive: true });
    window.addEventListener('mouseup', () => cursor?.classList.remove('qstar-cursor-down'), { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
      state.visible = false;
      cursor?.classList.remove('qstar-cursor-visible');
    });
    document.documentElement.addEventListener('mouseenter', () => {
      if (state.active) {
        state.visible = true;
        cursor?.classList.add('qstar-cursor-visible');
      }
    });

    rafId = window.requestAnimationFrame(animate);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('pagehide', () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  }, { once: true });
})();
