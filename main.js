import './style.css'
import { translations } from './translations.js'

// Simple Intersection Observer for Fade-in animations
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.card, .showcase-content, .showcase-img-wrapper, .science-content, .science-img-wrapper');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
  
  // Blob mouse movement
  const blob = document.querySelector('.blob');
  if (blob) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      blob.style.transform = `translate(${x * 50 - 25}px, ${y * 50 - 25}px)`;
    });
  }

  // --- I18n Logic ---
  const langSwitcher = document.getElementById('lang-switcher');
  
  // Detect language on load (default to 'en')
  let currentLang = 'en';
  const browserLang = navigator.language.slice(0, 2);
  if (translations[browserLang]) {
    currentLang = browserLang;
  }
  
  langSwitcher.value = currentLang;
  applyLanguage(currentLang);

  langSwitcher.addEventListener('change', (e) => {
    currentLang = e.target.value;
    applyLanguage(currentLang);
  });

  function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Handle RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }

    // Replace text for all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Special handle for HTML injection in specific fields (like showcase_title_1)
        if (key === 'showcase_title_1') {
          el.innerHTML = dict[key];
        } else {
          // If it's the child span inside showcase_title_1, we skip modifying it via textContent 
          // to avoid destroying the parent's innerHTML which already holds the correct structure.
          if (!el.classList.contains('data-i18n-child')) {
            el.textContent = dict[key];
          }
        }
      }
    });
  }

  // --- Cookie Banner & Legal Logic ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const modalOverlay = document.getElementById('legal-modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const linkImpressum = document.getElementById('link-impressum');
  const linkPrivacy = document.getElementById('link-privacy');

  // Check for existing consent
  if (!localStorage.getItem('cookie-consent')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'true');
    cookieBanner.classList.remove('show');
  });

  // Modal Functionality
  function openLegalModal(type) {
    const dict = translations[currentLang];
    if (type === 'impressum') {
      modalTitle.textContent = dict.impressum_title;
      modalBody.innerHTML = dict.impressum_content;
    } else {
      modalTitle.textContent = dict.privacy_title;
      modalBody.innerHTML = dict.privacy_content;
    }
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }

  function closeLegalModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  linkImpressum.addEventListener('click', () => openLegalModal('impressum'));
  linkPrivacy.addEventListener('click', () => openLegalModal('privacy'));
  modalClose.addEventListener('click', closeLegalModal);

  // Close modal on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeLegalModal();
  });
});
