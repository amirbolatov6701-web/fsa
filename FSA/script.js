/* ═══════════════════════════════════════════════════
   FSA — Future Skills Academy
   Main Script  |  Black + Logo Blue Theme
═══════════════════════════════════════════════════ */
'use strict';

// ─── Loader ──────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 2000);
  });
})();

// ─── Bootstrap ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 680, easing: 'ease-out-cubic', once: true, offset: 50 });
  }
  initNavbar();
  initMobileMenu();
  initParticles();
  initForm();
  initSmoothScroll();
  initActiveNav();
});

// ─── Navbar ──────────────────────────────────────────
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    if (y > 350) {
      nav.style.transform = y > last + 6 ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    last = y;
  }, { passive: true });
}

// ─── Mobile Menu ─────────────────────────────────────
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu   = document.querySelector('.mobile-menu');
  const links  = document.querySelectorAll('.mobile-link');
  if (!burger || !menu) return;

  function toggle(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  }

  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  links.forEach(l => l.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
}

// ─── Particle Canvas ─────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, pts;
  const N = window.innerWidth < 600 ? 35 : 65;
  const COLS = ['rgba(61,90,224,', 'rgba(122,181,245,', 'rgba(91,127,239,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    pts = Array.from({ length: N }, () => ({
      x: Math.random() * W,  y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      c: COLS[Math.floor(Math.random() * COLS.length)],
      a: Math.random() * 0.45 + 0.1,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(61,90,224,${0.055 * (1 - d / 95)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  resize(); spawn(); tick();
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { resize(); spawn(); }, 200); });
}

// ─── Contact Form ─────────────────────────────────────
function initForm() {
  const form = document.getElementById('contactForm');
  const ok   = document.getElementById('formOk');
  const btn  = document.getElementById('submitBtn');
  if (!form) return;

  function validate(inp) {
    const err = inp.parentElement.querySelector('.f-error');
    let msg = '';
    if (inp.required && !inp.value.trim()) msg = 'Обязательное поле';
    else if (inp.type === 'email' && inp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) msg = 'Некорректный email';
    if (err) err.textContent = msg;
    inp.classList.toggle('error', !!msg);
    return !msg;
  }

  form.querySelectorAll('input, textarea').forEach(f => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => { if (f.classList.contains('error')) validate(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => { if (!validate(f)) valid = false; });
    if (!valid) return;

    btn.disabled = true;
    const t = btn.querySelector('.btn-text');
    if (t) t.textContent = 'Отправка...';

    await new Promise(r => setTimeout(r, 1000));

    form.reset();
    if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    btn.disabled = false;
    if (t) t.textContent = 'Отправить сообщение';
    setTimeout(() => { if (ok) ok.hidden = true; }, 6000);
  });
}

// ─── Smooth Scroll ────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
}

// ─── Active Nav Highlight ─────────────────────────────
function initActiveNav() {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-38% 0px -38% 0px' }).observe
  ? secs.forEach(s => new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-38% 0px -38% 0px' }).observe(s))
  : null;
}
