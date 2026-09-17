/**
 * ====================================================================
 * ARIFULLAH PORTFOLIO - CORE APPLICATION CONTROLLER
 * ====================================================================
 * Manages theme switching, dynamic rendering from config, navigation,
 * custom cursor, smooth scrolling, modal behaviors, and form validations.
 */

(function () {
  'use strict';

  const config = window.CONFIG || {};

  // ====================================================================


  // ====================================================================
  // 2. THEME CONTROLLER (Dark / Light Mode)
  // ====================================================================
  function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('arifullah_theme') || 'dark';

    function setTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('arifullah_theme', theme);

      if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
          icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }
    }

    setTheme(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
      });
    }
  }

  // ====================================================================
  // 3. NAVIGATION & SCROLL CONTROLLER
  // ====================================================================
  function initNavigation() {
    const navbar = document.getElementById('main-navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    }, { passive: true });

    if (mobileMenuBtn && navLinksContainer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navLinksContainer.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
        });
      });
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '-30% 0px -60% 0px'
      });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  // ====================================================================
  // 4. HERO ANIMATED TYPEWRITER
  // ====================================================================
  function initTypewriter() {
    const target = document.getElementById('typewriter-text');
    if (!target) return;

    const roles = config.personal?.roles || [
      "Software Engineer",
      "Web Developer",
      "App Developer",
      "Full-Stack Developer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        target.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        target.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // ====================================================================
  // 5. DYNAMIC DATA POPULATION FROM CONFIG
  // ====================================================================
  function populateContent() {
    document.querySelectorAll('[data-bind="name"]').forEach(el => el.textContent = config.personal?.name || 'Arifullah');
    document.querySelectorAll('[data-bind="title"]').forEach(el => el.textContent = config.personal?.title || 'Software Engineer | Web & App Developer');
    document.querySelectorAll('[data-bind="availability"]').forEach(el => el.textContent = config.personal?.availabilityBadge || 'Available for Opportunities');

    const profileImg = document.getElementById('hero-profile-img');
    if (profileImg) {
      const candidatePaths = [
        'ChatGPT Image Aug 17, 2026, 04_33_54 AM.png',
        config.personal?.photoPath || 'profile.jpg',
        'profile.png',
        'profile.jpeg',
        'profile.webp',
        'profile-placeholder.svg'
      ];
      let candidateIndex = 0;

      function tryNextImage() {
        if (candidateIndex < candidatePaths.length - 1) {
          candidateIndex++;
          profileImg.src = candidatePaths[candidateIndex];
        } else {
          profileImg.src = config.personal?.photoFallback || 'profile-placeholder.svg';
        }
      }

      profileImg.onerror = tryNextImage;
      profileImg.src = candidatePaths[0];
    }

    const cvButtons = document.querySelectorAll('.btn-download-cv');
    cvButtons.forEach(btn => {
      btn.href = config.personal?.cvPath || 'cv.html';
      btn.setAttribute('target', '_blank');
    });

    if (config.socials) {
      document.querySelectorAll('[data-social]').forEach(el => {
        const key = el.getAttribute('data-social');
        if (config.socials[key]) {
          el.setAttribute('href', config.socials[key].url);
          el.setAttribute('title', `${config.socials[key].name}: ${config.socials[key].username || ''}`);
        }
      });
    }

    renderSkills();
    renderServices();
    renderEducation();
    renderJourney();
    renderLanguages();
  }

  function renderSkills() {
    const container = document.getElementById('skills-grid');
    if (!container || !config.skills) return;

    container.innerHTML = config.skills.map(skill => `
      <div class="skill-card" data-tilt data-tilt-max="12" data-category="${skill.category}">
        <div class="skill-card-inner">
          <div class="skill-icon-box" style="--skill-color: ${skill.color}">
            <i class="${skill.icon}"></i>
          </div>
          <div class="skill-content">
            <div class="skill-header">
              <h3 class="skill-name">${escapeHtml(skill.name)}</h3>
              <span class="skill-percentage">${skill.level}%</span>
            </div>
            <p class="skill-desc">${escapeHtml(skill.desc)}</p>
            <div class="skill-progress-bar">
              <div class="skill-progress-fill" style="width: ${skill.level}%; background: linear-gradient(90deg, ${skill.color}, #22d3ee);"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container || !config.services) return;

    container.innerHTML = config.services.map((service, index) => `
      <div class="service-card" data-tilt data-tilt-max="14">
        <div class="service-card-glass">
          <div class="service-number">0${index + 1}</div>
          <div class="service-icon">
            <i class="${service.icon}"></i>
          </div>
          <h3 class="service-title">${escapeHtml(service.title)}</h3>
          <p class="service-description">${escapeHtml(service.desc)}</p>
          <ul class="service-features">
            ${service.features.map(f => `
              <li><i class="fas fa-check-circle"></i> <span>${escapeHtml(f)}</span></li>
            `).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  function renderEducation() {
    const container = document.getElementById('education-timeline');
    if (!container || !config.education) return;

    container.innerHTML = config.education.map(edu => `
      <div class="timeline-item ${edu.highlight ? 'highlight' : ''}">
        <div class="timeline-dot">
          <i class="${edu.icon}"></i>
        </div>
        <div class="timeline-content" data-tilt>
          <div class="timeline-period"><i class="fas fa-clock"></i> ${escapeHtml(edu.period)}</div>
          <h3 class="timeline-title">${escapeHtml(edu.degree)}</h3>
          <h4 class="timeline-institution"><i class="fas fa-school"></i> ${escapeHtml(edu.institution)}</h4>
          <p class="timeline-desc">${escapeHtml(edu.status)}</p>
        </div>
      </div>
    `).join('');
  }

  function renderJourney() {
    const container = document.getElementById('journey-timeline');
    if (!container || !config.journey) return;

    container.innerHTML = config.journey.map(step => `
      <div class="journey-card" data-tilt>
        <div class="journey-phase-badge">${escapeHtml(step.year)}</div>
        <div class="journey-icon-wrap">
          <i class="${step.icon}"></i>
        </div>
        <h3 class="journey-title">${escapeHtml(step.title)}</h3>
        <p class="journey-desc">${escapeHtml(step.desc)}</p>
      </div>
    `).join('');
  }

  function renderLanguages() {
    const container = document.getElementById('languages-grid');
    if (!container || !config.languages) return;

    container.innerHTML = config.languages.map(lang => `
      <div class="language-card">
        <div class="lang-card-header">
          <span class="lang-title"><i class="fas fa-comments"></i> ${escapeHtml(lang.name)}</span>
          <span class="lang-badge">${escapeHtml(lang.proficiency)}</span>
        </div>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: ${lang.level}%; background: linear-gradient(90deg, #8b5cf6, #22d3ee);"></div>
        </div>
      </div>
    `).join('');
  }

  // ====================================================================
  // 6. CONTACT FORM & DIRECT EMAIL DELIVERY (arifkhankkhan002@gmail.com)
  // ====================================================================
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('button[type="submit"]');
    const statusBox = document.getElementById('contact-status-box');
    const directGmailLink = document.getElementById('direct-gmail-btn');
    const directWaLink = document.getElementById('direct-wa-btn');

    const targetEmail = config.personal?.email || 'arifkhankkhan002@gmail.com';
    const targetWa = (config.personal?.phone || '+923138983870').replace(/[^0-9]/g, '');

    // Function to dynamically update direct links as user types
    function updateDirectLinks() {
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const su = encodeURIComponent(name ? `Portfolio Contact from ${name}` : 'Portfolio Inquiry');
      const body = encodeURIComponent(
        (name ? `Sender Name: ${name}\n` : '') +
        (email ? `Sender Email: ${email}\n\n` : '') +
        (message ? `Message:\n${message}` : '')
      );

      if (directGmailLink) {
        directGmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${su}&body=${body}`;
      }

      if (directWaLink) {
        const waText = encodeURIComponent(
          (name ? `Hi Arifullah, I am ${name}.\n` : 'Hi Arifullah,\n') +
          (message ? `${message}\n` : '') +
          (email ? `My Email: ${email}` : '')
        );
        directWaLink.href = `https://wa.me/${targetWa}?text=${waText}`;
      }
    }

    if (nameInput) nameInput.addEventListener('input', updateDirectLinks);
    if (emailInput) emailInput.addEventListener('input', updateDirectLinks);
    if (messageInput) messageInput.addEventListener('input', updateDirectLinks);
    updateDirectLinks();

    let isSubmitting = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.', 'error');
        if (statusBox) {
          statusBox.style.display = 'flex';
          statusBox.className = 'contact-status-box error';
          statusBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Please fill in all required fields.</span>';
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        if (statusBox) {
          statusBox.style.display = 'flex';
          statusBox.className = 'contact-status-box error';
          statusBox.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Please enter a valid email address (e.g. name@example.com).</span>';
        }
        return;
      }

      isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending message...</span>';
      }

      showToast('Sending message to ' + targetEmail + '...', 'info');

      const isLocalFile = window.location.protocol === 'file:';

      const payload = {
        name: name,
        email: email,
        message: message,
        _subject: `New Portfolio Contact Message from ${name}`,
        _template: 'table',
        _captcha: 'false'
      };

      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        let result = {};
        try {
          result = await response.json();
        } catch (_) {}

        if (response.ok && (result.success === 'true' || result.success === true)) {
          showToast('Thank you! Your message has been sent successfully.', 'success');
          if (statusBox) {
            statusBox.style.display = 'flex';
            statusBox.className = 'contact-status-box success';
            statusBox.innerHTML = `
              <i class="fas fa-circle-check"></i>
              <div>
                <strong style="font-size: 1rem; color: #10b981;">Message Delivered!</strong>
                <p style="font-size: 0.88rem; margin-top: 5px; line-height: 1.5; color: var(--text-secondary);">
                  Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been delivered directly to <strong>${escapeHtml(targetEmail)}</strong>. Arifullah will get back to you shortly.
                </p>
              </div>
            `;
          }
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message Sent!</span>';
          }
          form.reset();
          updateDirectLinks();
        } else {
          // FormSubmit needs one-time email activation or returned warning
          const messageText = result.message || '';
          if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-envelope"></i> <span>Activation Required</span>';
          }

          if (statusBox) {
            statusBox.style.display = 'flex';
            statusBox.className = 'contact-status-box warning';
            statusBox.innerHTML = `
              <i class="fas fa-triangle-exclamation"></i>
              <div>
                <strong style="font-size: 1rem; color: #8b5cf6;">FormSubmit Activation Required</strong>
                <p style="font-size: 0.88rem; margin-top: 5px; line-height: 1.5; color: var(--text-secondary);">
                  FormSubmit has sent a 1-time activation email to <strong>${escapeHtml(targetEmail)}</strong>.<br>
                  Please open Gmail (also check <strong>Spam / Promotions</strong> folder) and click <strong>"Activate Form"</strong> to activate delivery.<br>
                  <em>Or send this message directly via Gmail right now:</em>
                </p>
                <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.82rem; padding: 6px 14px; display: inline-flex; align-items:center; gap:6px;">
                    <i class="fas fa-envelope"></i> Open in Gmail Directly
                  </a>
                  <a href="mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent(message)}" class="btn btn-secondary" style="font-size: 0.82rem; padding: 6px 14px; display: inline-flex; align-items:center; gap:6px;">
                    <i class="fas fa-paper-plane"></i> Default Mail Client
                  </a>
                </div>
              </div>
            `;
          }
          showToast('FormSubmit activation email sent to Gmail.', 'info');
        }
      })
      .catch(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
        }

        if (statusBox) {
          statusBox.style.display = 'flex';
          statusBox.className = 'contact-status-box warning';
          statusBox.innerHTML = `
            <i class="fas fa-circle-exclamation"></i>
            <div>
              <strong style="font-size: 1rem; color: #8b5cf6;">Send Directly to Gmail</strong>
              <p style="font-size: 0.88rem; margin-top: 5px; line-height: 1.5; color: var(--text-secondary);">
                ${isLocalFile ? 'You are viewing from a local file. ' : ''}You can send your message directly to <strong>${escapeHtml(targetEmail)}</strong> with one click:
              </p>
              <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.82rem; padding: 6px 14px; display: inline-flex; align-items:center; gap:6px;">
                  <i class="fas fa-envelope"></i> Send via Gmail
                </a>
                <a href="mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent(message)}" class="btn btn-secondary" style="font-size: 0.82rem; padding: 6px 14px; display: inline-flex; align-items:center; gap:6px;">
                  <i class="fas fa-paper-plane"></i> Default Mail Client
                </a>
              </div>
            </div>
          `;
        }
        showToast('Choose Gmail or Default Mail to send.', 'info');
      })
      .finally(() => {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          setTimeout(() => {
            if (submitBtn && !submitBtn.innerHTML.includes('Send Message')) {
              submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
            }
          }, 6000);
        }
      });
    });
  }

  function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');

    toast.innerHTML = `
      <i class="fas ${icon}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ====================================================================
  // 7. CUSTOM CURSOR (DISABLED AS REQUESTED)
  // ====================================================================
  function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  function initModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.closeProjectModal) window.closeProjectModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (window.closeProjectModal) window.closeProjectModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        if (window.closeProjectModal) window.closeProjectModal();
      }
    });
  }

  function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-count'), 10);
          let current = 0;
          const duration = 1500;
          const step = Math.ceil(targetNum / (duration / 25));

          const timer = setInterval(() => {
            current += step;
            if (current >= targetNum) {
              el.textContent = targetNum + (el.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              el.textContent = current + (el.getAttribute('data-suffix') || '');
            }
          }, 25);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ====================================================================
  // 10. INTERACTIVE PROFILE PHOTO REVEAL CONTROLLER
  // ====================================================================
  function initPhotoReveal() {
    const card = document.querySelector('.photo-3d-card');
    if (!card) return;

    // Fresh animation trigger whenever cursor enters
    card.addEventListener('mouseenter', function () {
      const scanner = card.querySelector('.photo-laser-scanner');
      if (scanner) {
        scanner.style.animation = 'none';
        void scanner.offsetWidth;
        scanner.style.animation = '';
      }
      const glitch = card.querySelector('.photo-glitch-overlay');
      if (glitch) {
        glitch.style.animation = 'none';
        void glitch.offsetWidth;
        glitch.style.animation = '';
      }
    });

    // Touch / Mobile Click Toggle
    card.addEventListener('click', function () {
      card.classList.toggle('revealed');
      if (card.classList.contains('revealed')) {
        const scanner = card.querySelector('.photo-laser-scanner');
        if (scanner) {
          scanner.style.animation = 'none';
          void scanner.offsetWidth;
          scanner.style.animation = '';
        }
      }
    });

    // Keyboard support: Enter or Space
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('revealed');
      }
    });

    // Dismiss revealed state when clicking outside
    document.addEventListener('click', function (e) {
      if (!card.contains(e.target) && card.classList.contains('revealed')) {
        card.classList.remove('revealed');
      }
    });
  }

  function initApp() {
    initTheme();
    initNavigation();
    populateContent();
    initTypewriter();
    initContactForm();
    initCustomCursor();
    initModals();
    initStatsCounter();
    initPhotoReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
