import './style.css';
import { SceneManager } from './three/SceneManager.js';
import { GSAPAnimations } from './animations/GSAPAnimations.js';

// Bootstrapping the Website
document.addEventListener('DOMContentLoaded', () => {
  startPreloader();
});

function startPreloader() {
  const pctText = document.getElementById('loader-pct');
  const termEl = document.getElementById('loader-term');
  const preloader = document.getElementById('preloader');

  if (!pctText || !termEl || !preloader) {
    initializeWebsite();
    return;
  }

  // Preloader Log entries to display at certain loading points
  const logs = [
    { pct: 10, text: '> CONNECTING TO SECURE FIREBASE CLOUD GATEWAYS...', color: 'normal' },
    { pct: 25, text: '> DETECTING ACTIVE WORKSPACE CONFIGURATION...', color: 'normal' },
    { pct: 40, text: '> INITIALIZING WEBGL ENGINE (THREE.JS)...', color: 'normal' },
    { pct: 55, text: '> SYNCHRONIZING REAL-TIME MONGO_DB INSTANCE...', color: 'normal' },
    { pct: 70, text: '> SHIELD PROTOCOLS ACTIVE // ENCRYPTING OTP PIPES...', color: 'green' },
    { pct: 85, text: '> ESTABLISHING RAZORPAY DISBURSEMENT MATRIX...', color: 'normal' },
    { pct: 95, text: '> CORE INTERFACE LOADED. STANDBY FOR DISPLAY SYNC...', color: 'green' }
  ];

  let currentPct = 0;
  
  const interval = setInterval(() => {
    // Fast loading simulation
    currentPct += Math.floor(Math.random() * 4) + 1;
    if (currentPct >= 100) {
      currentPct = 100;
      clearInterval(interval);
      
      pctText.textContent = '100%';
      
      // Short delay after 100% to let user see it, then fade out
      setTimeout(() => {
        preloader.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';

        setTimeout(() => {
          preloader.style.display = 'none';
          initializeWebsite();
        }, 800);
      }, 500);
    } else {
      pctText.textContent = `${currentPct}%`;
      
      // Render terminal lines as percentage progresses
      const matchedLogIdx = logs.findIndex(log => log.pct <= currentPct && !log.displayed);
      if (matchedLogIdx !== -1) {
        logs[matchedLogIdx].displayed = true;
        const line = document.createElement('div');
        line.className = `terminal-line ${logs[matchedLogIdx].color === 'green' ? 'green' : ''}`;
        line.textContent = logs[matchedLogIdx].text;
        termEl.appendChild(line);
        termEl.scrollTop = termEl.scrollHeight; // Auto-scroll
      }
    }
  }, 50);
}

function initializeWebsite() {
  // 1. Initialize 3D Engine
  const sceneManager = new SceneManager('canvas-container');

  // 2. Initialize GSAP Scroll triggers, cursor effects, card tilts
  const animations = new GSAPAnimations();

  // 3. Play dramatic brand typing intro
  animations.playIntro(() => {
    // Once typing and navbar animations complete, activate interactive components
    initMobileMenu();
    initPhoneCarousel();
    initWebUseDropdown();
  });
}

// 4. Mobile Menu Interactions
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    header.classList.toggle('nav-active');
  });

  // Close overlay on nav link clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      header.classList.remove('nav-active');
    });
  });
}

// 5. App Screenshot Phone Carousel
function initPhoneCarousel() {
  const slides = document.querySelectorAll('.phone-slide');
  const dots = document.querySelectorAll('.phone-dot');
  
  if (slides.length === 0 || dots.length === 0) return;

  let currentIdx = 0;
  let carouselTimer;

  const showSlide = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[idx].classList.add('active');
    dots[idx].classList.add('active');
    currentIdx = idx;
  };

  const nextSlide = () => {
    let nextIdx = (currentIdx + 1) % slides.length;
    showSlide(nextIdx);
  };

  // Auto transition every 3.5s
  const startTimer = () => {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextSlide, 3500);
  };

  // Dot Click Manual Overrides
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startTimer(); // Reset auto timer
    });
  });

  startTimer();
}

// 6. Web Use Dropdown Interaction
function initWebUseDropdown() {
  const containers = document.querySelectorAll('.web-use-dropdown-container');

  containers.forEach((container) => {
    const trigger = container.querySelector('.web-use-btn');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = container.classList.contains('active');

      // Close other dropdowns
      containers.forEach((otherContainer) => {
        if (otherContainer !== container) {
          otherContainer.classList.remove('active');
          const otherTrigger = otherContainer.querySelector('.web-use-btn');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      container.classList.toggle('active');
      trigger.setAttribute('aria-expanded', !isActive);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    containers.forEach((container) => {
      if (!container.contains(e.target)) {
        container.classList.remove('active');
        const trigger = container.querySelector('.web-use-btn');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
