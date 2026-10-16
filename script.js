/**
 * CHETAN PRAJAPAT — PERSONAL PORTFOLIO SCRIPT
 * Features:
 * 1. Dynamic copyright year
 * 2. Profile photo load & automatic fallback handler
 * 3. Accessible mobile navigation menu toggle
 * 4. Scroll-triggered section reveal animations (IntersectionObserver)
 * 5. Active navigation link highlighting on scroll
 * 6. Deep-space animated starfield canvas with reduced-motion support
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. AUTOMATIC COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     2. PROFILE PHOTO LOAD & GRACEFUL FALLBACK
     -------------------------------------------------------------------------- */
  const profileImg = document.getElementById('profile-photo');
  const profileFallback = document.getElementById('profile-fallback');

  if (profileImg && profileFallback) {
    const showFallback = () => {
      profileImg.classList.add('is-hidden');
      profileFallback.classList.add('is-active');
    };

    const showPhoto = () => {
      profileImg.classList.remove('is-hidden');
      profileFallback.classList.remove('is-active');
    };

    profileImg.addEventListener('error', showFallback);
    profileImg.addEventListener('load', () => {
      if (profileImg.naturalWidth > 0) {
        showPhoto();
      } else {
        showFallback();
      }
    });

    // Handle case where browser already evaluated the image before script ran
    if (profileImg.complete) {
      if (profileImg.naturalWidth === 0) {
        showFallback();
      } else {
        showPhoto();
      }
    }
  }

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('mobile-nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. SCROLL-TRIGGERED SECTION REVEALS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     5. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  /* --------------------------------------------------------------------------
     6. DEEP SPACE STARFIELD CANVAS
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let stars = [];
  let animationFrameId = null;

  const starColors = ['#F5F7FF', '#65A8FF', '#5CE1F4', '#A88BFF', '#A4AECA'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
    if (prefersReducedMotion) {
      drawStaticStars();
    }
  }

  function createStars() {
    const area = canvas.width * canvas.height;
    const count = Math.min(160, Math.max(55, Math.floor(area / 11000)));
    stars = [];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.45 + 0.35,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.65 + 0.2,
        speedY: Math.random() * 0.18 + 0.04,
        twinkleSpeed: Math.random() * 0.012 + 0.004,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function drawStaticStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function animateStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Subtle vertical drift
      s.y -= s.speedY;
      if (s.y < 0) {
        s.y = canvas.height;
        s.x = Math.random() * canvas.width;
      }

      // Gentle twinkle
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 0.9) {
        s.alpha = 0.9;
        s.twinkleDir = -1;
      } else if (s.alpha <= 0.2) {
        s.alpha = 0.2;
        s.twinkleDir = 1;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationFrameId = window.requestAnimationFrame(animateStarfield);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  if (!prefersReducedMotion) {
    animateStarfield();
  }
});
