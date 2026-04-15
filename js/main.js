/**
 * Soumojit Chowdhury — Portfolio
 * main.js — Interactivity & Animations
 */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ============================================================
   DYNAMIC YEAR
   ============================================================ */
const yearEl = $('#footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   NAVBAR — scroll effect + active link tracking
   ============================================================ */
(function initNavbar() {
  const navbar   = $('#navbar');
  const toggle   = $('#nav-toggle');
  const navLinks = $('#nav-links');
  const links    = $$('.nav-link');

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Show/hide scroll-to-top
    const btn = $('#scroll-top');
    if (btn) {
      const show = window.scrollY > 400;
      btn.classList.toggle('visible', show);
      btn.hidden = !show;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link via Intersection Observer on sections
  const sections = $$('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */
(function initScrollTop() {
  const btn = $('#scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   REVEAL ANIMATIONS (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        const delay = clamp(idx * 80, 0, 400);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el     = $('#typed-text');
  if (!el) return;

  const phrases = [
    'Lead Data Scientist',
    'GenAI & LLM Architect',
    'Fraud Detection Systems',
    'ML Production Pipelines',
    'Deep Learning Models',
    'RAG-powered AI Apps',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  const TYPE_SPEED   = 70;
  const DELETE_SPEED = 35;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }
  setTimeout(tick, 900);
})();

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  // Prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { canvas.style.display = 'none'; return; }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.8 + 0.5,
      o:  Math.random() * 0.5 + 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.o})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    animId = requestAnimationFrame(draw);
  }

  // Pause when tab hidden (battery/perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else draw();
  });

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });
  ro.observe(canvas.parentElement);
  resize();
  draw();
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form       = $('#contact-form');
  if (!form) return;

  const nameInput  = $('#cf-name');
  const emailInput = $('#cf-email');
  const subjectIn  = $('#cf-subject');
  const msgInput   = $('#cf-message');
  const submitBtn  = $('#submit-btn');
  const btnText    = $('#btn-text');
  const btnIcon    = $('#btn-icon');
  const successEl  = $('#form-success');
  const errorEl    = $('#form-error-msg');

  /* --- Validators --- */
  function validateName(val) {
    if (!val.trim())        return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  }
  function validateEmail(val) {
    if (!val.trim()) return 'Email is required.';
    // RFC-5322 simplified pattern
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(val.trim())) return 'Please enter a valid email address.';
    return '';
  }
  function validateSubject(val) {
    if (!val.trim()) return 'Subject is required.';
    if (val.trim().length < 3) return 'Subject must be at least 3 characters.';
    return '';
  }
  function validateMessage(val) {
    if (!val.trim()) return 'Message is required.';
    if (val.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  }

  function showError(inputEl, errorId, msg) {
    const errEl = $('#' + errorId);
    if (!errEl) return;
    errEl.textContent = msg;
    inputEl.classList.toggle('invalid', !!msg);
  }

  /* Live validation */
  nameInput.addEventListener('blur', () => showError(nameInput, 'name-error', validateName(nameInput.value)));
  emailInput.addEventListener('blur', () => showError(emailInput, 'email-error', validateEmail(emailInput.value)));
  subjectIn.addEventListener('blur', () => showError(subjectIn, 'subject-error', validateSubject(subjectIn.value)));
  msgInput.addEventListener('blur', () => showError(msgInput, 'message-error', validateMessage(msgInput.value)));

  /* Clear error on input */
  [nameInput, emailInput, subjectIn, msgInput].forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('[name="_honeypot"]');
    if (honeypot && honeypot.value) return; // likely a bot

    const nameErr    = validateName(nameInput.value);
    const emailErr   = validateEmail(emailInput.value);
    const subjectErr = validateSubject(subjectIn.value);
    const msgErr     = validateMessage(msgInput.value);

    showError(nameInput,  'name-error',    nameErr);
    showError(emailInput, 'email-error',   emailErr);
    showError(subjectIn,  'subject-error', subjectErr);
    showError(msgInput,   'message-error', msgErr);

    if (nameErr || emailErr || subjectErr || msgErr) {
      // Focus first invalid field
      [nameInput, emailInput, subjectIn, msgInput]
        .find(el => el.classList.contains('invalid'))
        ?.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    btnIcon.className = 'fas fa-spinner fa-spin';
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body:   data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        form.reset();
        successEl.classList.remove('hidden');
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
      } else {
        throw new Error('Server error');
      }
    } catch (_) {
      // Fallback: open mailto
      const subject = encodeURIComponent(subjectIn.value || 'Contact from portfolio');
      const body    = encodeURIComponent(
        `Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\n${msgInput.value}`
      );
      window.location.href = `mailto:soumojit.chowdhury@gmail.com?subject=${subject}&body=${body}`;
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fas fa-paper-plane';
    }
  });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL (offset for fixed nav)
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();
