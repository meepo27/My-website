/* ─── Navbar ────────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.remove('transparent');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('transparent');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ─── Smooth scroll ─────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Particle canvas ───────────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.35 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 184, 232, ${p.alpha})`;
      ctx.fill();
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(74, 124, 199, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ─── Rotating hero tag ─────────────────────────────────────────────────────── */
(function () {
  const tag    = document.getElementById('hero-tag');
  const tagTxt = document.getElementById('hero-tag-text');
  const tagIco = document.getElementById('hero-tag-icon');
  if (!tag || !tagTxt || !tagIco) return;

  const items = [
    { icon: 'fa-solid fa-brain',            text: 'Data Science & Machine Learning' },
    { icon: 'fa-solid fa-shield-halved',    text: 'Financial Crime Analytics' },
    { icon: 'fa-solid fa-ban',              text: 'AML & Fraud Prevention' },
    { icon: 'fa-solid fa-diagram-project',  text: 'Graph Analytics & GenAI' },
  ];

  let idx = 0;

  setInterval(() => {
    tag.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % items.length;
      tagIco.className = items[idx].icon;
      tagTxt.textContent = items[idx].text;
      tag.style.opacity = '1';
    }, 350);
  }, 3000);
})();

/* ─── Typing animation ──────────────────────────────────────────────────────── */
(function () {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Lead Data Scientist',
    'Financial Crime Analytics Specialist',
    'AML & Money Mule Detection Expert',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTicks = 0;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx);
      charIdx++;
      if (charIdx > current.length) {
        charIdx = current.length;
        deleting = true;
        pauseTicks = 40;
      }
      setTimeout(tick, 65);
    } else {
      if (pauseTicks > 0) {
        pauseTicks--;
        setTimeout(tick, 30);
        return;
      }
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        setTimeout(tick, 400);
        return;
      }
      el.textContent = current.slice(0, charIdx);
      setTimeout(tick, 35);
    }
  }

  tick();
})();

/* ─── IntersectionObserver reveal ──────────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

/* ─── Scroll-to-top ─────────────────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── Contact form ──────────────────────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        statusEl.textContent = 'Message sent — thank you! I\'ll be in touch soon.';
        statusEl.className = 'success';
        form.reset();
      } else {
        throw new Error('Server responded with ' + res.status);
      }
    } catch {
      statusEl.textContent = 'Message could not be sent. Please email me directly at soumojit.chowdhury@gmail.com.';
      statusEl.className = 'error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
})();
