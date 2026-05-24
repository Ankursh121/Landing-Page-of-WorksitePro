import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class GSAPAnimations {
  constructor() {
    this.initCardTilt();
    this.initScrollReveals();
  }

  // 2. Typing Intro & Navbar Transition
  playIntro(onCompleteCallback) {
    const introOverlay = document.querySelector('.intro-overlay');
    const introLogoText = document.getElementById('intro-logo-text');
    const navLogo = document.querySelector('.nav-logo');
    const navItems = document.querySelectorAll('.nav-links li, .whatsapp-btn');
    const heroContent = document.querySelectorAll('.hero-text-block > *, .hero-ctas > *');

    if (!introOverlay || !introLogoText || !navLogo) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    const brandName = "WorksitePro";
    let charIndex = 0;

    // Clear placeholder
    introLogoText.textContent = "";

    // Dramatic typing effect (faster for responsiveness)
    const typingInterval = setInterval(() => {
      if (charIndex < brandName.length) {
        introLogoText.textContent += brandName.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Fast transition delay
        setTimeout(() => {
          triggerLogoTransition();
        }, 150);
      }
    }, 70);

    const triggerLogoTransition = () => {
      // Calculate target position (navLogo)
      const targetRect = navLogo.getBoundingClientRect();

      // Create high-end cinematic timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Hide intro elements and reveal the final navLogo static text
          introOverlay.style.display = 'none';
          introLogoText.style.display = 'none';
          navLogo.style.opacity = 1;
          
          if (onCompleteCallback) onCompleteCallback();
        }
      });

      // Fade out background overlay quickly
      tl.to(introOverlay, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.7,
        ease: 'power2.inOut'
      }, 0);

      // Animate logo size and position
      tl.to(introLogoText, {
        top: targetRect.top + (targetRect.height / 2),
        left: targetRect.left,
        xPercent: 0,
        yPercent: -50,
        fontSize: '1.8rem',
        textShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
        letterSpacing: '1px',
        duration: 0.9,
        ease: 'power3.inOut'
      }, 0);

      // Fade/slide in navbar elements concurrently
      tl.fromTo(navItems, {
        opacity: 0,
        y: -15
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.3);

      // Fade/slide in hero text and CTAs
      tl.fromTo(heroContent, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.4);
    };
  }

  // 3. 3D Card Hover Tilt Effect
  initCardTilt() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach((card) => {
      const glow = card.querySelector('.card-glow');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Cursor position relative to card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalized relative position (-0.5 to 0.5)
        const normX = (x / rect.width) - 0.5;
        const normY = (y / rect.height) - 0.5;

        // Rotation angles (max 15 degrees)
        const rotX = -normY * 18;
        const rotY = normX * 18;

        // Smooth tilt
        gsap.to(card, {
          transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Move radial glow overlay to track cursor
        if (glow) {
          gsap.to(glow, {
            left: `${x}px`,
            top: `${y}px`,
            opacity: 1,
            duration: 0.2
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        // Reset tilt and glow
        gsap.to(card, {
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          duration: 0.5,
          ease: 'power2.out'
        });

        if (glow) {
          gsap.to(glow, {
            opacity: 0,
            duration: 0.4
          });
        }
      });
    });
  }

  // 4. Scroll Trigger Reveals
  initScrollReveals() {
    // Reveal Feature Section Title
    gsap.fromTo('.features-header > *', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-header',
          start: 'top 85%'
        }
      }
    );

    // Reveal Feature Cards
    gsap.fromTo('.feature-card', 
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%'
        }
      }
    );

    // Reveal Download Section Elements
    gsap.fromTo('.download-content > *',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.download-container',
          start: 'top 75%'
        }
      }
    );

    gsap.fromTo('.phone-mockup-wrapper',
      { opacity: 0, scale: 0.9, x: 50, rotateY: -15 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        rotateY: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.download-container',
          start: 'top 75%'
        }
      }
    );

    // Expand glowing footer divider line
    gsap.fromTo('.footer-divider-glow',
      { width: '0%' },
      {
        width: '100%',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%'
        }
      }
    );

    // Reveal Footer Content
    gsap.fromTo('.footer-grid > *, .footer-bottom',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%'
        }
      }
    );
  }
}
