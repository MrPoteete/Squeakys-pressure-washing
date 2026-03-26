document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. Parallax — Hero Background Text
  // ---------------------------------------------------------------------------
  const heroBgText = document.querySelector('.hero-bg-text');

  if (heroBgText) {
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          heroBgText.style.transform = `translateY(${window.scrollY * 0.4}px)`;
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // 2. Fade-in on Scroll — Intersection Observer
  // ---------------------------------------------------------------------------
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          if (el.dataset.delay) {
            el.style.transitionDelay = `${el.dataset.delay}ms`;
          }

          el.classList.add('visible');
          fadeObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach((el) => fadeObserver.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 3. Nav — Shrink on Scroll
  // ---------------------------------------------------------------------------
  const nav = document.querySelector('nav');

  if (nav) {
    let navTicking = false;

    const updateNav = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      navTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(updateNav);
        navTicking = true;
      }
    }, { passive: true });

    // Run once on load in case the page is already scrolled (e.g. browser restore)
    updateNav();
  }

  // ---------------------------------------------------------------------------
  // 4. Mobile Nav Toggle
  // ---------------------------------------------------------------------------
  const navToggle = document.querySelector('[data-nav-toggle]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });

    // Close nav when any nav link is clicked (event delegation)
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a') && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Booking Form Validation
  // ---------------------------------------------------------------------------
  const bookingForm = document.querySelector('[data-form="booking"]');

  if (bookingForm) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const getGroup = (field) => field.closest('.form-group');

    const setError = (field) => {
      const group = getGroup(field);
      if (group) group.classList.add('error');
    };

    const clearError = (field) => {
      const group = getGroup(field);
      if (group) group.classList.remove('error');
    };

    // Remove error state as the user starts correcting their input
    bookingForm.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        clearError(e.target);
      }
    });

    bookingForm.addEventListener('change', (e) => {
      if (e.target.matches('input, textarea, select')) {
        clearError(e.target);
      }
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField    = bookingForm.querySelector('[name="name"]');
      const phoneField   = bookingForm.querySelector('[name="phone"]');
      const emailField   = bookingForm.querySelector('[name="email"]');
      const addressField = bookingForm.querySelector('[name="address"]');

      let valid = true;

      // Validate name
      if (nameField) {
        if (!nameField.value.trim()) {
          setError(nameField);
          valid = false;
        } else {
          clearError(nameField);
        }
      }

      // Validate phone — require at least 10 digits
      if (phoneField) {
        const digits = phoneField.value.replace(/\D/g, '');
        if (digits.length < 10) {
          setError(phoneField);
          valid = false;
        } else {
          clearError(phoneField);
        }
      }

      // Validate email
      if (emailField) {
        if (!emailRegex.test(emailField.value.trim())) {
          setError(emailField);
          valid = false;
        } else {
          clearError(emailField);
        }
      }

      // Validate address
      if (addressField) {
        if (!addressField.value.trim()) {
          setError(addressField);
          valid = false;
        } else {
          clearError(addressField);
        }
      }

      if (valid) {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = "Thanks! We'll be in touch shortly.";
        bookingForm.insertAdjacentElement('afterend', successMsg);
        bookingForm.style.display = 'none';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Smooth Anchor Scroll
  // ---------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');

      // Ignore bare "#" links with no target
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: 'smooth' });

      // Close mobile nav if it is open
      if (nav && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
      }
    });
  });

});
