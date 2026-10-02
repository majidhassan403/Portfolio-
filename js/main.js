/* ============================================================
   Majid Hassan — Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle — multiple buttons
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  const htmlEl = document.documentElement;

  const getTheme = () => htmlEl.getAttribute('data-theme') || 'light';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#26291C' : '#F1EDD8');
    themeToggles.forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    });
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  applyTheme(getTheme());

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  // Follow OS preference
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches ? 'dark' : 'light');
    };
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else if (mql.addListener) mql.addListener(handler);
  }

  // Live local time — Pakistan Standard Time
  const timeEl = document.getElementById('local-time');
  if (timeEl) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const tick = () => { timeEl.textContent = formatter.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const isTyping =
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      (e.target && e.target.isContentEditable);

    if (isTyping) return;

    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }

    if (e.key === '1') window.location.hash = '#home';
    if (e.key === '2') window.location.hash = '#about';
    if (e.key === '3') window.location.hash = '#projects';
    if (e.key === '4') window.location.hash = '#contact';
  });

  // Hero typing effect
  const typedRole = document.getElementById('typed-role');
  if (typedRole) {
    const roles = ['MERN Stack Developer', 'React Developer', 'Full Stack Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      const loop = () => {
        const current = roles[roleIndex];
        if (deleting) {
          typedRole.textContent = current.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typedRole.textContent = current.substring(0, charIndex + 1);
          charIndex++;
        }

        let delay = deleting ? 45 : 90;

        if (!deleting && charIndex === current.length) {
          delay = 2200;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 500;
        }

        timer = setTimeout(loop, delay);
      };
      timer = setTimeout(loop, 800);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (timer) clearTimeout(timer);
        } else {
          timer = setTimeout(loop, 400);
        }
      });
    }
  }

  // Stat counters
  const statValues = document.querySelectorAll('.stat__value[data-count]');
  if (statValues.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1600;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statValues.forEach((el) => obs.observe(el));
  } else {
    statValues.forEach((el) => {
      el.textContent = el.getAttribute('data-count') || '0';
    });
  }

  // Header + progress + scroll buttons
  const header = document.getElementById('site-header');
  const progressFill = document.getElementById('progress-fill');
  const scrollActions = document.getElementById('scroll-actions');
  const upBtn = scrollActions ? scrollActions.querySelector('[data-dir="up"]') : null;
  const downBtn = scrollActions ? scrollActions.querySelector('[data-dir="down"]') : null;
  const mobileMenu = document.getElementById('mobile-menu');

  let ticking = false;
  let lastScrollY = window.pageYOffset;

  function updateScrollUI() {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
    const atTop = scrollY < 50;
    const atBottom = scrollY >= docHeight - 50;

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 30);

      // Auto-hide on scroll down, show on scroll up
      const menuOpen = mobileMenu && mobileMenu.classList.contains('is-open');
      const scrollingDown = scrollY > lastScrollY + 8;
      const scrollingUp = scrollY < lastScrollY - 8;

      if (!menuOpen) {
        if (scrollY > 300 && scrollingDown) {
          header.classList.add('is-hidden');
        } else if (scrollingUp || scrollY < 120) {
          header.classList.remove('is-hidden');
        }
      } else {
        header.classList.remove('is-hidden');
      }
    }

    if (progressFill) progressFill.style.width = progress + '%';
    if (upBtn) upBtn.disabled = atTop;
    if (downBtn) downBtn.disabled = atBottom;

    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }

  updateScrollUI();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollUI);

  if (upBtn) upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (downBtn) downBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  });

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (header) header.classList.remove('is-hidden');
  }

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains('is-open')) closeMenu();
    else openMenu();
  }

  if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
    mobileNavLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
  }

  if ((navLinks.length || mobileNavLinks.length) && sections.length) {
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  // Message counter
  const messageField = document.getElementById('message');
  const messageCounter = document.getElementById('message-counter');

  if (messageField && messageCounter) {
    const MAX = 500;
    const update = () => {
      const len = messageField.value.length;
      messageCounter.textContent = len + ' / ' + MAX;
      messageCounter.classList.remove('is-warning', 'is-danger');
      if (len >= MAX) messageCounter.classList.add('is-danger');
      else if (len >= MAX * 0.85) messageCounter.classList.add('is-warning');
    };
    messageField.addEventListener('input', update);
    update();
  }

  // Toast + copy
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  const copyButtons = document.querySelectorAll('.copy-btn[data-copy]');
  const copyMessages = {
    email: 'Email copied to clipboard',
    phone: 'Phone number copied',
    link: 'Link copied to clipboard'
  };

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      if (!text) return;

      const type = btn.getAttribute('data-copy-type') || 'link';
      const msg = copyMessages[type] || 'Copied to clipboard';

      const mark = () => {
        btn.classList.add('is-copied');
        showToast(msg);
        setTimeout(() => btn.classList.remove('is-copied'), 1800);
      };

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          mark();
        } else {
          fallbackCopy(text);
          mark();
        }
      } catch (err) {
        fallbackCopy(text);
        mark();
      }
    });
  });

  // Form auto-save
  const contactForm = document.getElementById('contact-form');
  const autosaveHint = document.getElementById('autosave-hint');
  const AUTOSAVE_KEY = 'mh_contact_draft_v1';
  let autosaveTimer = null;
  let hintShown = false;

  function formFields() {
    if (!contactForm) return [];
    return ['name', 'email', 'projectType', 'budget', 'message']
      .map((name) => contactForm.querySelector('[name="' + name + '"]'))
      .filter(Boolean);
  }

  function saveDraft() {
    if (!contactForm) return;
    try {
      const data = {};
      formFields().forEach((f) => {
        if (f.value && f.value.trim()) data[f.name] = f.value;
      });
      if (!Object.keys(data).length) {
        localStorage.removeItem(AUTOSAVE_KEY);
        return;
      }
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
      if (autosaveHint && !hintShown) {
        autosaveHint.hidden = false;
        hintShown = true;
      }
    } catch (e) {}
  }

  function restoreDraft() {
    if (!contactForm) return;
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;

      let restored = false;
      formFields().forEach((f) => {
        if (data[f.name] && !f.value) {
          f.value = data[f.name];
          restored = true;
        }
      });

      if (restored) {
        if (messageField) messageField.dispatchEvent(new Event('input'));
        if (autosaveHint) autosaveHint.hidden = false;
        hintShown = true;
      }
    } catch (e) {
      try { localStorage.removeItem(AUTOSAVE_KEY); } catch (err) {}
    }
  }

  function clearDraft() {
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch (e) {}
    if (autosaveHint) autosaveHint.hidden = true;
    hintShown = false;
  }

  if (contactForm) {
    restoreDraft();
    contactForm.addEventListener('input', () => {
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(saveDraft, 600);
    });
    contactForm.addEventListener('change', () => {
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(saveDraft, 300);
    });
  }

  // Form validation
  const form = contactForm;
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    const validators = {
      name: (v) => {
        if (!v.trim()) return 'Please enter your name.';
        if (v.trim().length < 2) return 'Name is too short.';
        return '';
      },
      email: (v) => {
        if (!v.trim()) return 'Please enter your email.';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v.trim())) return 'Please enter a valid email address.';
        return '';
      },
      projectType: (v) => {
        if (!v) return 'Please select a project type.';
        return '';
      },
      message: (v) => {
        if (!v.trim()) return 'Please write a message.';
        if (v.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    };

    function showError(name, msg) {
      const field = form.querySelector('[name="' + name + '"]');
      const errorEl = form.querySelector('[data-error-for="' + name + '"]');
      if (!field || !errorEl) return;
      if (msg) {
        field.closest('.field')?.classList.add('has-error');
        errorEl.textContent = msg;
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.closest('.field')?.classList.remove('has-error');
        errorEl.textContent = '';
        field.removeAttribute('aria-invalid');
      }
    }

    function validateField(name) {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field || !validators[name]) return true;
      const msg = validators[name](field.value);
      showError(name, msg);
      return !msg;
    }

    ['name', 'email', 'projectType', 'message'].forEach((name) => {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      field.addEventListener('blur', () => validateField(name));
      field.addEventListener('input', () => {
        const errorEl = form.querySelector('[data-error-for="' + name + '"]');
        if (errorEl && errorEl.textContent) validateField(name);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = ['name', 'email', 'projectType', 'message'];
      const valid = fields.map((f) => validateField(f)).every(Boolean);

      if (!valid) {
        const first = form.querySelector('.field.has-error input, .field.has-error select, .field.has-error textarea');
        first?.focus();
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Please fix the highlighted fields and try again.';
        }
        return;
      }

      const originalBtn = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }
      if (status) {
        status.className = 'form-status';
        status.textContent = '';
      }

      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        // Replace this with a real fetch() to your backend when ready
        await new Promise((resolve) => setTimeout(resolve, 900));

        if (status) {
          status.className = 'form-status is-success';
          status.textContent = 'Thanks, ' + payload.name.split(' ')[0] + ' — your message has been received. I\'ll get back to you within a day or two.';
        }
        form.reset();

        if (messageCounter) {
          messageCounter.textContent = '0 / 500';
          messageCounter.classList.remove('is-warning', 'is-danger');
        }

        form.querySelectorAll('.field.has-error').forEach((f) => f.classList.remove('has-error'));
        form.querySelectorAll('.field__error').forEach((el) => (el.textContent = ''));

        clearDraft();
      } catch (err) {
        console.error('Form submission error:', err);
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Something went wrong. Please try again, or reach me on LinkedIn.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtn;
        }
      }
    });
  }

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = 80;
      const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', id);
    });
  });

  // Console greeting
  console.log('%cHey there 👋', 'font-size:14px;font-weight:bold;color:#4A5220;');
  console.log('%cMajid Hassan — github.com/majidhassan403', 'font-size:12px;color:#5E6146;');
});
