/**
 * NEXA AGENCY - Core Interactive JavaScript
 * Production-ready scripts for theme toggling, scroll reveals,
 * animated counters, portfolio filtering, and form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Theme Toggle (Dark / Light Mode) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('nexa-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('nexa-theme', theme);

    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill text-primary';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  };

  // Initialize theme
  applyTheme(currentTheme);

  // Toggle on click
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(active);
    });
  });

  // --- 2. Sticky Navbar on Scroll ---
  const navbar = document.querySelector('.nexa-navbar');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 3. Scroll Reveal Animation (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- 4. Animated Statistics Counter ---
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeOut * target);

        el.textContent = `${prefix}${currentCount}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(animate);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  // --- 5. Back To Top Button ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 6. Portfolio Category Filter ---
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const categories = item.getAttribute('data-category') || '';
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // --- 7. Portfolio Detail Modal Handler ---
  const projectModal = document.getElementById('projectDetailModal');
  if (projectModal) {
    const modalImage = document.getElementById('modalProjectImage');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalCategory = document.getElementById('modalProjectCategory');
    const modalClient = document.getElementById('modalProjectClient');
    const modalDeliverable = document.getElementById('modalProjectDeliverable');
    const modalDescription = document.getElementById('modalProjectDescription');
    const modalTech = document.getElementById('modalProjectTech');
    const modalMetric = document.getElementById('modalProjectMetric');

    document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#projectDetailModal"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const card = trigger.closest('.portfolio-card') || trigger;
        if (!card) return;

        if (modalImage) modalImage.src = card.getAttribute('data-image') || '';
        if (modalTitle) modalTitle.textContent = card.getAttribute('data-title') || 'Project Showcase';
        if (modalCategory) modalCategory.textContent = card.getAttribute('data-badge') || 'Web App';
        if (modalClient) modalClient.textContent = card.getAttribute('data-client') || 'Enterprise Partner';
        if (modalDeliverable) modalDeliverable.textContent = card.getAttribute('data-deliverable') || 'Full-Stack Solution';
        if (modalDescription) modalDescription.textContent = card.getAttribute('data-desc') || '';
        if (modalTech) modalTech.textContent = card.getAttribute('data-tech') || 'Modern Tech Stack';
        if (modalMetric) modalMetric.textContent = card.getAttribute('data-metric') || '+150% Performance';
      });
    });
  }

  // --- 8. Contact Form Handling & Live Feedback ---
  const contactForm = document.getElementById('nexaContactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        contactForm.classList.remove('was-validated');

        if (formSuccessAlert) {
          formSuccessAlert.classList.remove('d-none');
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            formSuccessAlert.classList.add('d-none');
          }, 6000);
        }
      }, 900);
    });
  }

  // --- 9. Newsletter Form Handling ---
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim() !== '') {
        const btn = form.querySelector('button');
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg"></i>';
        btn.classList.add('btn-success');

        setTimeout(() => {
          input.value = '';
          btn.innerHTML = origText;
          btn.classList.remove('btn-success');
          alert('Thank you for subscribing to Nexa Insights! Check your inbox for confirmation.');
        }, 800);
      }
    });
  });

});
