/* ---------------------------------------------------------
   Fahad Khan | Premium Portfolio Script
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (mobileMenuToggle && mobileMenuMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuMenu.classList.contains('hidden');
      if (isExpanded) {
        mobileMenuMenu.classList.remove('hidden');
        mobileMenuMenu.classList.add('flex');
        // Icon swap to X if present
        const menuIcon = mobileMenuToggle.querySelector('[data-lucide="menu"]');
        const xIcon = mobileMenuToggle.querySelector('[data-lucide="x"]');
        if (menuIcon && xIcon) {
          menuIcon.classList.add('hidden');
          xIcon.classList.remove('hidden');
        }
      } else {
        mobileMenuMenu.classList.add('hidden');
        mobileMenuMenu.classList.remove('flex');
        const menuIcon = mobileMenuToggle.querySelector('[data-lucide="menu"]');
        const xIcon = mobileMenuToggle.querySelector('[data-lucide="x"]');
        if (menuIcon && xIcon) {
          menuIcon.classList.remove('hidden');
          xIcon.classList.add('hidden');
        }
      }
    });

    // Close menu when clicking mobile links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuMenu.classList.add('hidden');
        mobileMenuMenu.classList.remove('flex');
        const menuIcon = mobileMenuToggle.querySelector('[data-lucide="menu"]');
        const xIcon = mobileMenuToggle.querySelector('[data-lucide="x"]');
        if (menuIcon && xIcon) {
          menuIcon.classList.remove('hidden');
          xIcon.classList.add('hidden');
        }
      });
    });
  }

  // 3. Reveal on Scroll Animation System
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Active Navigation Highlight based on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Interactive Projects Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategories = card.getAttribute('data-categories').split(' ');
          if (category === 'all' || cardCategories.includes(category)) {
            card.classList.remove('hidden');
            // Retrigger minor entrance animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 6. Interactive Floating Neural-Net Canvas
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const particles = [];
    const particleCount = Math.min(60, window.innerWidth > 768 ? 55 : 25);
    const connectionDistance = 120;
    let mouse = { x: null, y: null, active: false };

    // Handle Resize
    window.addEventListener('resize', () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    });

    // Handle mouse move relative to container bounds
    const container = canvas.parentElement;
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    container.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Attracted by mouse
        if (mouse.active && mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.fill();
      }
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect them
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.08;
            ctx.strokeStyle = `rgba(217, 119, 6, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Main animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      requestAnimationFrame(animate);
    }

    animate();
  }

  // 7. Dynamic Impact Counter Animations
  const statsElements = document.querySelectorAll('.stat-count');
  const statCardSection = document.querySelector('#impact');

  let countersAnimated = false;

  const animateCounters = () => {
    statsElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1600; // ms
      const increment = target / (duration / 16);

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          stat.textContent = target.toLocaleString() + suffix;
        } else {
          stat.textContent = Math.ceil(current).toLocaleString() + suffix;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  };

  if (statCardSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          setTimeout(() => {
            animateCounters();
          }, 200);
          countersAnimated = true;
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counterObserver.observe(statCardSection);
  }

  // 8. Copy Email Clipboard functionality with Visual Toast
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = '3brotherskhan635@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        // Show customized toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-950 border border-amber-500/30 px-5 py-3 rounded-xl shadow-lg shadow-amber-500/10 text-amber-400 font-medium font-sans text-sm animate-bounce';
        toast.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          Email copied to clipboard!
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s ease';
          setTimeout(() => toast.remove(), 500);
        }, 2200);
      });
    });
  }

  // 9. Contact Form Simulation with visual status states
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple premium feedback loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const loader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

      if (submitBtn && btnText && loader) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
      }

      // Simulate network request
      setTimeout(() => {
        contactForm.reset();
        
        if (submitBtn && btnText && loader) {
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          loader.classList.add('hidden');
        }

        // Show successful message in a beautiful container
        formStatus.classList.remove('hidden');
        formStatus.className = 'mt-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-450 text-sm flex items-center gap-2';
        formStatus.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          Thank you for reaching out, Fahad! Your message has been sent successfully.
        `;

        setTimeout(() => {
          formStatus.classList.add('hidden');
        }, 5000);
      }, 1500);
    });
  }
});
