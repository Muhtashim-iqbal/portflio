/* ============================================================
   MUHTASHIM IQBAL AHMED K — Portfolio JavaScript
   ============================================================ */

'use strict';

/* ── 1. NAVBAR: scroll state + mobile toggle ── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const drawer  = document.getElementById('navDrawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  // Scroll state
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('open')) {
      if (!drawer.contains(e.target) && !toggle.contains(e.target)) {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
      }
    }
  });
})();


/* ── 2. SCROLL REVEAL ── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();


/* ── 3. SKILL BARS: animate on scroll ── */
(function initSkillBars() {
  const panels = document.querySelectorAll('.skill-panel');
  if (!panels.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 110);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  panels.forEach(panel => observer.observe(panel));
})();


/* ── 4. CHART BAR ANIMATION: trigger when in view ── */
(function initChartBars() {
  const showcaseCards = document.querySelectorAll('.showcase-card');
  if (!showcaseCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.chart-bar');
        bars.forEach(bar => {
          // Reset then re-trigger
          bar.style.animation = 'none';
          void bar.offsetHeight; // reflow
          bar.style.animation = '';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  showcaseCards.forEach(card => observer.observe(card));
})();


/* ── 5. SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 6. ACTIVE NAV LINK (section spy) ── */
(function initSectionSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#navbar .nav-menu a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--_active', '0');
        });
        const active = document.querySelector(`#navbar .nav-menu a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--white)';
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
  });

  sections.forEach(s => observer.observe(s));
})();


/* ── 7. COUNTER ANIMATION for hero metrics ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix ?? '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1600;
    let   startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => observer.observe(el));
})();


/* ── 8. CURSOR GLOW (desktop only) ── */
(function initCursorGlow() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position:     'fixed',
    pointerEvents:'none',
    zIndex:       '9999',
    width:        '400px',
    height:       '400px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)',
    transform:    'translate(-50%, -50%)',
    transition:   'opacity 0.4s ease',
    top:          '0px',
    left:         '0px',
  });
  document.body.appendChild(glow);

  let raf;
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  const lerp = (a, b, t) => a + (b - a) * t;

  const loop = () => {
    cx = lerp(cx, mx, 0.1);
    cy = lerp(cy, my, 0.1);
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(loop);
  };
  loop();

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
})();


/* ── 9. YEAR in footer ── */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 10. DOWNLOAD RESUME placeholder ── */
(function initResumeBtn() {
  document.querySelectorAll('[data-action="download-resume"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Replace '#' with the actual resume PDF path when available
      alert('Resume download link — please link your resume PDF here.');
    });
  });
})();


/* ── 11. THEME TOGGLE (Dark / Light Mode) ── */
(function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const mobileToggleBtn = document.getElementById('mobileThemeToggle');
  const body = document.body;
  
  // Check for saved user preference, if any, on load
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'light') {
    body.classList.add('light-theme');
    updateIcons(true);
  }

  function updateIcons(isLight) {
    const iconClass = isLight ? 'fa-moon' : 'fa-sun';
    const oldClass = isLight ? 'fa-sun' : 'fa-moon';
    
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if(icon) {
        icon.classList.remove(oldClass);
        icon.classList.add(iconClass);
      }
    }
    
    if (mobileToggleBtn) {
      const icon = mobileToggleBtn.querySelector('i');
      if(icon) {
        icon.classList.remove(oldClass);
        icon.classList.add(iconClass);
      }
    }
  }

  function toggleTheme() {
    body.classList.toggle('light-theme');
    let theme = 'dark';
    let isLight = body.classList.contains('light-theme');
    
    if (isLight) {
      theme = 'light';
    }
    
    localStorage.setItem('theme', theme);
    updateIcons(isLight);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
  
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleTheme);
  }
})();

