/* ============================================================
   IRON JUNGLE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== ELEMENTS ===== */
  const cursor        = document.getElementById('cursor');
  const cursorRing    = document.getElementById('cursorRing');
  const loginIconBtn  = document.getElementById('loginIconBtn');
  const modalOverlay  = document.getElementById('modalOverlay');
  const modalContainer = document.getElementById('modalContainer');
  const closeModalBtn = document.getElementById('closeModal');
  const hamburger     = document.getElementById('hamburger');
  const navList       = document.getElementById('navList');
  const navOverlay    = document.getElementById('navOverlay');
  const navLoginBtn   = document.getElementById('navLoginBtn');

  // Modal panels & tabs
  const signInPanel   = document.getElementById('signInPanel');
  const signUpPanel   = document.getElementById('signUpPanel');
  const tabSignIn     = document.getElementById('tabSignIn');
  const tabSignUp     = document.getElementById('tabSignUp');

  const toSignUp      = document.getElementById('toSignUp');  // mobile switch link in sign-in form
  const toSignIn      = document.getElementById('toSignIn');  // mobile switch link in sign-up form
  
  // Desktop toggle buttons
  const desktopToSignUp = document.getElementById('desktopToSignUp');
  const desktopToSignIn = document.getElementById('desktopToSignIn');

  /* ============================================================
     CUSTOM CURSOR (desktop only)
     ============================================================ */
  if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll(
      'a, button, .login-icon, .program-card, .trainer-card, .membership-table tbody tr'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
        cursorRing.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.opacity = '1';
      });
    });
  }


  /* ============================================================
     DRAGGABLE LOGIN ICON
     ============================================================ */
  let isDragging  = false;
  let hasDragged  = false;
  let startX, startY, startLeft, startTop;

  function getPointerPos(e) {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX,            y: e.clientY };
  }

  function onDragStart(e) {
    const pos  = getPointerPos(e);
    const rect = loginIconBtn.getBoundingClientRect();
    startX     = pos.x;
    startY     = pos.y;
    startLeft  = rect.left;
    startTop   = rect.top;
    isDragging = true;
    hasDragged = false;

    loginIconBtn.classList.add('dragging');
    // Switch from right-anchored to left-anchored positioning
    loginIconBtn.style.right = 'auto';
    loginIconBtn.style.left  = startLeft + 'px';
    loginIconBtn.style.top   = startTop  + 'px';

    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const pos = getPointerPos(e);
    const dx  = pos.x - startX;
    const dy  = pos.y - startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged = true;

    const newLeft = Math.max(8, Math.min(window.innerWidth  - 60, startLeft + dx));
    const newTop  = Math.max(8, Math.min(window.innerHeight - 60, startTop  + dy));

    loginIconBtn.style.left = newLeft + 'px';
    loginIconBtn.style.top  = newTop  + 'px';

    e.preventDefault();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    loginIconBtn.classList.remove('dragging');
    if (!hasDragged) openModal();
  }

  loginIconBtn.addEventListener('mousedown',  onDragStart);
  loginIconBtn.addEventListener('touchstart', onDragStart, { passive: false });
  document.addEventListener('mousemove',  onDragMove);
  document.addEventListener('touchmove',  onDragMove, { passive: false });
  document.addEventListener('mouseup',    onDragEnd);
  document.addEventListener('touchend',   onDragEnd);

  // Keyboard accessibility
  loginIconBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });


  function isMobile() { return window.innerWidth <= 768; }

  function openModal(showSignup = false) {
    if (showSignup) {
      setSignUp();
    } else {
      setSignIn();
    }
    modalOverlay.classList.add('active');
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalContainer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open triggers
  loginIconBtn.addEventListener('click', () => { /* handled by drag logic */ });
  navLoginBtn?.addEventListener('click', e => { e.preventDefault(); openModal(); });

  // Close triggers
  closeModalBtn?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


  /* ============================================================
     MODAL — SIGN IN / SIGN UP SWITCHING
     ============================================================ */
  function setSignIn() {
    // Desktop slide
    modalContainer.classList.remove('show-signup');
    // Mobile tabs
    tabSignIn?.classList.add('active');
    tabSignUp?.classList.remove('active');
    // Mobile panels
    if (isMobile()) {
      signInPanel.classList.add('visible');
      signUpPanel.classList.remove('visible');
    }
  }

  function setSignUp() {
    // Desktop slide
    modalContainer.classList.add('show-signup');
    // Mobile tabs
    tabSignUp?.classList.add('active');
    tabSignIn?.classList.remove('active');
    // Mobile panels
    if (isMobile()) {
      signUpPanel.classList.add('visible');
      signInPanel.classList.remove('visible');
    }
  }

  // Initialize: sign-in panel visible on mobile by default
  if (isMobile()) signInPanel.classList.add('visible');

  // Desktop toggle buttons
  desktopToSignUp?.addEventListener('click', setSignUp);
  desktopToSignIn?.addEventListener('click', setSignIn);

  // Mobile tabs
  tabSignIn?.addEventListener('click', setSignIn);
  tabSignUp?.addEventListener('click', setSignUp);

  // Mobile in-form switch links
  toSignUp?.addEventListener('click', setSignUp);
  toSignIn?.addEventListener('click', setSignIn);

  // Handle resize (switching between mobile/desktop modes)
  window.addEventListener('resize', () => {
    if (isMobile()) {
      // Ensure correct panel visibility matches current tab
      if (tabSignUp?.classList.contains('active')) {
        signUpPanel.classList.add('visible');
        signInPanel.classList.remove('visible');
      } else {
        signInPanel.classList.add('visible');
        signUpPanel.classList.remove('visible');
      }
    }
  });


  /* ============================================================
     HAMBURGER NAVIGATION
     ============================================================ */
  function openNav() {
    hamburger.classList.add('open');
    navList.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navList.classList.contains('open') ? closeNav() : openNav();
  });

  navOverlay.addEventListener('click', closeNav);

  // Close nav when a link is clicked
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Keyboard accessibility
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navList.classList.contains('open') ? closeNav() : openNav();
    }
  });


  /* ============================================================
     NAVBAR SCROLL OPACITY (desktop)
     ============================================================ */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (!isMobile()) {
      navbar.style.opacity = window.scrollY > 80 ? '0.88' : '1';
    }
  }, { passive: true });


  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================================
     SMOOTH ANCHOR SCROLL (accounts for fixed navbar on mobile)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0)') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = isMobile() ? 72 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ============================================================
     CONTACT FORM — basic feedback
     ============================================================ */
  const contactForm = document.querySelector('.contact-form-box form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg, #28a745, #1a7a30)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});