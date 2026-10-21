/* ==========================================================================
   Kelvin Kipngetich Kiplangat — Portfolio behaviour
   --------------------------------------------------------------------------
   Vanilla JavaScript only. Everything here is progressive enhancement: the
   page remains readable and navigable if this file fails to load.

   Contents
     1. Configuration (edit this block only)
     2. Small helpers
     3. Mobile navigation
     4. Header state, scroll spy and back-to-top
     5. Reveal-on-scroll animation
     6. Contact details (email slot, copy button, optional LinkedIn)
     7. Contact form validation and delivery
     8. Footer year
     9. Boot
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION
     --------------------------------------------------------------------------
     Leave a value as '' (empty string) unless you can verify it. Nothing here
     contains a secret: this file is served publicly, so never place an API key,
     password or private token in it.

       CONTACT_EMAIL    Your real email address. When set, it is displayed in the
                        Contact section and used for the mailto: fallback.
       FORM_ENDPOINT    A form-delivery service URL (for example Formspree).
                        When set, the form posts to it with fetch().
       GITHUB_PROFILE   Public GitHub profile URL.
       LINKEDIN_PROFILE Public LinkedIn URL. Only add it once the profile exists
                        and you want it visible.
     ========================================================================== */

  const CONFIG = {
    CONTACT_EMAIL: '',
    FORM_ENDPOINT: '',
    GITHUB_PROFILE: 'https://github.com/Kipngetichkelvin',
    LINKEDIN_PROFILE: ''
  };

  /* ==========================================================================
     2. SMALL HELPERS
     ========================================================================== */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const MIN_NAME_LENGTH = 2;
  const MIN_MESSAGE_LENGTH = 15;

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopNavQuery = window.matchMedia('(min-width: 900px)');

  function prefersReducedMotion() {
    return reduceMotionQuery.matches;
  }

  function isValidEmail(value) {
    return EMAIL_PATTERN.test(String(value).trim());
  }

  function trimValue(value) {
    return String(value == null ? '' : value).trim();
  }

  /* ==========================================================================
     3. MOBILE NAVIGATION
     ========================================================================== */

  const header = document.getElementById('site-header');
  const nav = document.getElementById('primary-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function isNavOpen() {
    return !!(nav && nav.classList.contains('is-open'));
  }

  function setNavOpen(open, returnFocus) {
    if (!nav || !navToggle) return;

    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (!open && returnFocus) {
      navToggle.focus();
    }
  }

  function closeNav(options) {
    const settings = options || {};
    if (!isNavOpen()) return;
    setNavOpen(false, settings.returnFocus === true);
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!isNavOpen(), false);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // On mobile the drawer covers the page, so close it after navigating.
        closeNav({ returnFocus: false });
      });
    });

    document.addEventListener('click', function (event) {
      if (!isNavOpen()) return;
      if (header && header.contains(event.target)) return;
      closeNav({ returnFocus: false });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' && event.key !== 'Esc') return;
      if (!isNavOpen()) return;
      closeNav({ returnFocus: true });
    });

    const handleDesktopChange = function (event) {
      if (event.matches) closeNav({ returnFocus: false });
    };

    if (typeof desktopNavQuery.addEventListener === 'function') {
      desktopNavQuery.addEventListener('change', handleDesktopChange);
    } else if (typeof desktopNavQuery.addListener === 'function') {
      desktopNavQuery.addListener(handleDesktopChange);
    }
  }

  /* ==========================================================================
     4. HEADER STATE, SCROLL SPY AND BACK-TO-TOP
     ========================================================================== */

  const toTopButton = document.getElementById('to-top');

  const spySections = navLinks
    .map(function (link) {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return null;
      const section = document.getElementById(href.slice(1));
      if (!section) return null;
      return { id: section.id, section: section, link: link };
    })
    .filter(Boolean);

  function headerOffset() {
    return (header ? header.getBoundingClientRect().height : 72) + 24;
  }

  function markActiveLink(activeId) {
    if (!activeId) return;
    spySections.forEach(function (entry) {
      const isActive = entry.id === activeId;
      entry.link.classList.toggle('is-active', isActive);
      if (isActive) {
        entry.link.setAttribute('aria-current', 'location');
      } else {
        entry.link.removeAttribute('aria-current');
      }
    });
  }

  function updateScrollSpy() {
    if (!spySections.length) return;

    const threshold = headerOffset();
    let activeId = spySections[0].id;

    spySections.forEach(function (entry) {
      if (entry.section.getBoundingClientRect().top <= threshold) {
        activeId = entry.id;
      }
    });

    // Near the bottom of the document the last section is the relevant one.
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const viewportBottom = scrollTop + window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    if (documentHeight - viewportBottom < 8) {
      activeId = spySections[spySections.length - 1].id;
    }

    markActiveLink(activeId);
  }

  function updateHeaderState() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (header) {
      header.classList.toggle('is-scrolled', scrollTop > 8);
    }

    if (toTopButton) {
      const shouldShow = scrollTop > 600;
      if (shouldShow) {
        toTopButton.removeAttribute('hidden');
      } else {
        toTopButton.setAttribute('hidden', '');
      }
    }
  }

  if (toTopButton) {
    toTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  let scrollFrameRequested = false;

  function onScroll() {
    if (scrollFrameRequested) return;
    scrollFrameRequested = true;

    window.requestAnimationFrame(function () {
      scrollFrameRequested = false;
      updateHeaderState();
      updateScrollSpy();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ==========================================================================
     5. REVEAL-ON-SCROLL ANIMATION
     ========================================================================== */

  const revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealAll() {
    revealTargets.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  function initReveal() {
    if (!revealTargets.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealTargets.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ==========================================================================
     6. CONTACT DETAILS
     ========================================================================== */

  function buildCopyButton(email) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-email';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy email address to clipboard');

    let resetTimer = null;

    function showCopyFeedback(message) {
      button.textContent = message;
      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        button.textContent = 'Copy';
      }, 2200);
    }

    function legacyCopy() {
      const helper = document.createElement('textarea');
      helper.value = email;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();

      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }

      document.body.removeChild(helper);
      return copied;
    }

    function copyEmail() {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(email).then(
          function () {
            showCopyFeedback('Copied');
          },
          function () {
            showCopyFeedback(legacyCopy() ? 'Copied' : 'Press Ctrl+C');
          }
        );
        return;
      }

      showCopyFeedback(legacyCopy() ? 'Copied' : 'Press Ctrl+C');
    }

    button.addEventListener('click', copyEmail);
    return button;
  }

  function renderEmailSlot() {
    const slot = document.getElementById('contact-email-slot');
    if (!slot) return;

    const email = trimValue(CONFIG.CONTACT_EMAIL);

    if (!email) {
      // The markup already contains the honest "not configured" note.
      return;
    }

    if (!isValidEmail(email)) {
      console.warn(
        '[portfolio] CONTACT_EMAIL in js/main.js is not a valid address, so the ' +
          'placeholder note is being shown instead.'
      );
      return;
    }

    slot.textContent = '';

    const link = document.createElement('a');
    link.className = 'contact-value contact-link';
    link.href = 'mailto:' + email;
    link.textContent = email;
    slot.appendChild(link);

    slot.appendChild(buildCopyButton(email));
  }

  function renderSocialLinks() {
    const socialList = document.querySelector('.footer-social ul');
    const linkedin = trimValue(CONFIG.LINKEDIN_PROFILE);

    if (!socialList || !linkedin) return;
    if (!/^https?:\/\//i.test(linkedin)) {
      console.warn('[portfolio] LINKEDIN_PROFILE must be a full https:// URL. Skipped.');
      return;
    }

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = linkedin;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'LinkedIn';

    item.appendChild(link);
    socialList.appendChild(item);
  }

  /* ==========================================================================
     7. CONTACT FORM
     --------------------------------------------------------------------------
     The site is static. It can only deliver a message when FORM_ENDPOINT points
     at a real form service; otherwise it opens the visitor's email application
     (mailto:) or explains that delivery is not configured. It never claims a
     message was sent when it was not.
     ========================================================================== */

  const form = document.getElementById('contact-form');

  function initContactForm() {
    if (!form) return;

    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      subject: document.getElementById('subject'),
      message: document.getElementById('message')
    };

    const errors = {
      name: document.getElementById('name-error'),
      email: document.getElementById('email-error'),
      subject: null,
      message: document.getElementById('message-error')
    };

    const honeypot = document.getElementById('company-site');
    const submitButton = document.getElementById('form-submit');
    const status = document.getElementById('form-status');
    const submitLabel = submitButton ? submitButton.textContent : '';

    function setFieldError(key, message) {
      const field = fields[key];
      const errorBox = errors[key];

      if (field) {
        if (message) {
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.removeAttribute('aria-invalid');
        }
      }

      if (errorBox) {
        errorBox.textContent = message || '';
        if (message) {
          errorBox.removeAttribute('hidden');
        } else {
          errorBox.setAttribute('hidden', '');
        }
      }
    }

    function setStatus(message, state) {
      if (!status) return;

      status.textContent = message || '';
      status.classList.remove('is-success', 'is-error', 'is-info');

      if (state) {
        status.classList.add('is-' + state);
      }
    }

    function setPending(isPending) {
      if (!submitButton) return;
      submitButton.disabled = !!isPending;
      submitButton.textContent = isPending ? 'Sending…' : submitLabel;
    }

    function validateName() {
      const value = trimValue(fields.name && fields.name.value);
      if (!value) {
        setFieldError('name', 'Please enter your name.');
        return false;
      }
      if (value.length < MIN_NAME_LENGTH) {
        setFieldError('name', 'Please enter at least ' + MIN_NAME_LENGTH + ' characters.');
        return false;
      }
      setFieldError('name', '');
      return true;
    }

    function validateEmail() {
      const value = trimValue(fields.email && fields.email.value);
      if (!value) {
        setFieldError('email', 'Please enter your email address.');
        return false;
      }
      if (!isValidEmail(value)) {
        setFieldError('email', 'Please enter a valid email address, for example name@example.com.');
        return false;
      }
      setFieldError('email', '');
      return true;
    }

    function validateMessage() {
      const value = trimValue(fields.message && fields.message.value);
      if (!value) {
        setFieldError('message', 'Please enter a message.');
        return false;
      }
      if (value.length < MIN_MESSAGE_LENGTH) {
        setFieldError(
          'message',
          'Please add a little more detail (at least ' + MIN_MESSAGE_LENGTH + ' characters).'
        );
        return false;
      }
      setFieldError('message', '');
      return true;
    }

    function validateForm() {
      // Run every check so all errors appear at once, then focus the first one.
      const results = [validateName(), validateEmail(), validateMessage()];
      const valid = results.every(Boolean);

      if (!valid) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid && typeof firstInvalid.focus === 'function') {
          firstInvalid.focus();
        }
      }

      return valid;
    }

    function buildMailtoHref(email) {
      const name = trimValue(fields.name && fields.name.value);
      const from = trimValue(fields.email && fields.email.value);
      const subjectField = trimValue(fields.subject && fields.subject.value);
      const message = trimValue(fields.message && fields.message.value);

      const subject = subjectField || 'Portfolio enquiry from ' + (name || 'a website visitor');

      const bodyLines = [
        'Name: ' + name,
        'Email: ' + from,
        '',
        message
      ];

      return (
        'mailto:' +
        email +
        '?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(bodyLines.join('\n'))
      );
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setStatus('', null);

      // Honeypot: a real visitor never sees or fills this field.
      if (honeypot && trimValue(honeypot.value) !== '') {
        setStatus('Thanks for reaching out.', 'success');
        form.reset();
        return;
      }

      if (!validateForm()) {
        setStatus('Please correct the highlighted fields and try again.', 'error');
        return;
      }

      const endpoint = trimValue(CONFIG.FORM_ENDPOINT);
      const email = trimValue(CONFIG.CONTACT_EMAIL);

      if (endpoint) {
        setPending(true);
        setStatus('Sending your message…', 'info');

        fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('the service responded with status ' + response.status);
            }
            setStatus(
              'Thank you — your message was sent. I will reply as soon as I can.',
              'success'
            );
            form.reset();
            Object.keys(fields).forEach(function (key) {
              setFieldError(key, '');
            });
          })
          .catch(function (error) {
            setStatus(
              'Sorry, your message could not be sent (' +
                error.message +
                '). Please try again, or contact me directly using the details on the left.',
              'error'
            );
          })
          .then(function () {
            setPending(false);
          });

        return;
      }

      if (email && isValidEmail(email)) {
        window.location.href = buildMailtoHref(email);
        setStatus(
          'This page did not send your message itself. Your email application should now ' +
            'open with these details filled in — press send there to reach me.',
          'info'
        );
        return;
      }

      setStatus(
        'Message delivery is not configured on this site yet, so nothing was sent. ' +
          'Delivery is enabled in js/main.js — see the Configuration section of README.md.',
        'info'
      );
    });

    // Clear a field's error as soon as the visitor starts fixing it.
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (!field) return;

      field.addEventListener('input', function () {
        if (field.hasAttribute('aria-invalid')) {
          setFieldError(key, '');
        }
      });

      field.addEventListener('blur', function () {
        if (key === 'name') validateName();
        if (key === 'email') validateEmail();
        if (key === 'message') validateMessage();
      });
    });
  }

  /* ==========================================================================
     8. FOOTER YEAR
     ========================================================================== */

  function renderYear() {
    const year = String(new Date().getFullYear());
    const slots = document.querySelectorAll('[data-year]');

    Array.prototype.forEach.call(slots, function (slot) {
      slot.textContent = year;
    });
  }

  /* ==========================================================================
     9. BOOT
     ========================================================================== */

  function boot() {
    renderYear();
    renderEmailSlot();
    renderSocialLinks();
    initReveal();
    initContactForm();
    updateHeaderState();
    updateScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
