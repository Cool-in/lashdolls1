document.addEventListener('DOMContentLoaded', () => {
  // Initialize Custom Cursor
  initCustomCursor();

  // Scroll Actions
  initScrollActions();

  // Mobile Menu
  initMobileMenu();

  // Services Filter
  initServicesFilter();

  // Lightbox Gallery
  initLightbox();

  // Reviews Carousel
  initReviewsCarousel();

  // Booking Wizard
  initBookingWizard();

  // Live Opening Hours Status
  updateLiveSalonStatus();
  // Update status every minute
  setInterval(updateLiveSalonStatus, 60000);
});

/* ==========================================
   1. CUSTOM CURSOR
   ========================================== */
function initCustomCursor() {
  const cursorDot = document.createElement('div');
  const cursorFollower = document.createElement('div');
  
  cursorDot.classList.add('custom-cursor');
  cursorFollower.classList.add('custom-cursor-follower');
  
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lerp animation for the follower ring
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states on interactive elements
  const interactiveSelector = 'a, button, .filter-btn, .gallery-item, .review-nav-btn, .service-book-btn, select, input, textarea';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('hovering-interactive');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('hovering-interactive');
    }
  });
}

/* ==========================================
   2. SCROLL ACTIONS (Navbar & Intersection Observer)
   ========================================== */
function initScrollActions() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scrolled header background
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   3. MOBILE MENU
   ========================================== */
function initMobileMenu() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================
   4. SERVICES FILTER
   ========================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      // Filter cards
      serviceCards.forEach(card => {
        card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

/* ==========================================
   5. LIGHTBOX GALLERY
   ========================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').getAttribute('src');
      lightboxImg.setAttribute('src', imgSrc);
      lightbox.classList.add('active');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================
   6. REVIEWS CAROUSEL
   ========================================== */
function initReviewsCarousel() {
  const track = document.querySelector('.reviews-track');
  const nextBtn = document.querySelector('.review-nav-btn.next');
  const prevBtn = document.querySelector('.review-nav-btn.prev');
  const cards = document.querySelectorAll('.review-card');
  
  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  
  function getCardsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 991) return 2;
    return 3;
  }

  function updateCarousel() {
    const cardsPerView = getCardsPerView();
    const maxIndex = cards.length - cardsPerView;
    
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const gap = 30; // standard space-between
    const amountToMove = currentIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${amountToMove}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const maxIndex = cards.length - getCardsPerView();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  window.addEventListener('resize', updateCarousel);
  
  // Drag & Swipe touch support
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  
  track.addEventListener('touchstart', touchStart);
  track.addEventListener('touchend', touchEnd);
  track.addEventListener('touchmove', touchMove);
  
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', touchEnd);
  track.addEventListener('mousemove', touchMove);

  function touchStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    animationID = requestAnimationFrame(animation);
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const movedBy = currentTranslate - prevTranslate;
    const cardWidth = cards[0].offsetWidth + 30;
    
    if (movedBy < -100) {
      // swipe left (next)
      const maxIndex = cards.length - getCardsPerView();
      if (currentIndex < maxIndex) currentIndex++;
    } else if (movedBy > 100) {
      // swipe right (prev)
      if (currentIndex > 0) currentIndex--;
    }
    
    updateCarousel();
    // Reset values
    const cardsPerView = getCardsPerView();
    const maxIndex = cards.length - cardsPerView;
    const gap = 30;
    const cWidth = cards[0].offsetWidth;
    prevTranslate = -currentIndex * (cWidth + gap);
  }

  function touchMove(event) {
    if (isDragging) {
      const currentX = getPositionX(event);
      currentTranslate = prevTranslate + (currentX - startX);
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }
}

/* ==========================================
   7. BOOKING WIZARD & CONTACT FORM
   ========================================== */
function initBookingWizard() {
  const wizardSteps = document.querySelectorAll('.wizard-form-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const nextBtns = document.querySelectorAll('.wizard-next');
  const prevBtns = document.querySelectorAll('.wizard-prev');
  const serviceSelect = document.getElementById('book-service');
  const dateInput = document.getElementById('book-date');
  const timeSelect = document.getElementById('book-time');
  const nameInput = document.getElementById('book-name');
  const phoneInput = document.getElementById('book-phone');
  const submitBtn = document.querySelector('.wizard-submit');
  
  let currentStepIndex = 0;

  // Book service links from treatments menu
  document.querySelectorAll('.service-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-name');
      if (serviceName && serviceSelect) {
        serviceSelect.value = serviceName;
        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Move to next step
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStepIndex)) {
        currentStepIndex++;
        updateWizard();
      }
    });
  });

  // Move to previous step
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStepIndex--;
      updateWizard();
    });
  });

  // Step Validation
  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      if (serviceSelect.value === "") {
        alert("Por favor, selecciona un servicio.");
        return false;
      }
    } else if (stepIndex === 1) {
      if (dateInput.value === "" || timeSelect.value === "") {
        alert("Por favor, selecciona una fecha y hora.");
        return false;
      }
    } else if (stepIndex === 2) {
      if (nameInput.value.trim() === "" || phoneInput.value.trim() === "") {
        alert("Por favor, introduce tu nombre y número de teléfono.");
        return false;
      }
    }
    return true;
  }

  // Update DOM for wizard steps
  function updateWizard() {
    // Hide/Show steps
    wizardSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStepIndex);
    });

    // Update indicators
    stepIndicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === currentStepIndex);
      indicator.classList.toggle('completed', idx < currentStepIndex);
    });

    // Populate Summary
    if (currentStepIndex === 3) {
      document.getElementById('summary-service').innerText = serviceSelect.options[serviceSelect.selectedIndex].text;
      document.getElementById('summary-date').innerText = formatDateString(dateInput.value);
      document.getElementById('summary-time').innerText = timeSelect.options[timeSelect.selectedIndex].text;
      document.getElementById('summary-name').innerText = nameInput.value;
      document.getElementById('summary-phone').innerText = phoneInput.value;
    }
  }

  function formatDateString(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Form Submission
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Simulate API call to send book appointment request
      submitBtn.innerText = "PROCESANDO...";
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Success state
        document.querySelector('.wizard-booking-flow').style.display = 'none';
        document.querySelector('.booking-success').style.display = 'block';
      }, 1500);
    });
  }

  // Set minimum date for input (today)
  if (dateInput) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}

/* ==========================================
   8. LIVE SALON OPENING HOURS STATUS (Madrid timezone)
   ========================================== */
function updateLiveSalonStatus() {
  const liveStatusBadge = document.getElementById('live-status-badge');
  const liveStatusText = document.getElementById('live-status-text');
  
  if (!liveStatusBadge || !liveStatusText) return;

  // Spain is in Europe/Madrid timezone
  const madridTimeStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" });
  const madridDate = new Date(madridTimeStr);
  
  const day = madridDate.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  const hours = madridDate.getHours();
  const minutes = madridDate.getMinutes();
  const currentTimeVal = hours * 100 + minutes; // HHMM format e.g., 1430 for 14:30

  let isOpen = false;
  let closingInfo = '';
  let openingInfo = '';

  // Monday = 1, Sunday = 0
  // Tue - Fri: 09:30 - 19:30 (0930 to 1930)
  // Sat: 09:30 - 14:00 (0930 to 1400)
  
  // Clear existing highlight
  document.querySelectorAll('.hours-row').forEach(row => row.classList.remove('current-day'));
  
  // Highlight active row in schedule (Translate standard JS day index to Spanish rows)
  let targetRowId = '';
  switch(day) {
    case 1: targetRowId = 'hours-mon'; break;
    case 2: targetRowId = 'hours-tue'; break;
    case 3: targetRowId = 'hours-wed'; break;
    case 4: targetRowId = 'hours-thu'; break;
    case 5: targetRowId = 'hours-fri'; break;
    case 6: targetRowId = 'hours-sat'; break;
    case 0: targetRowId = 'hours-sun'; break;
  }
  const activeRow = document.getElementById(targetRowId);
  if (activeRow) activeRow.classList.add('current-day');

  if (day >= 2 && day <= 5) { // Tuesday - Friday
    if (currentTimeVal >= 930 && currentTimeVal < 1930) {
      isOpen = true;
      closingInfo = '19:30';
    } else {
      openingInfo = 'mañana a las 09:30';
    }
  } else if (day === 6) { // Saturday
    if (currentTimeVal >= 930 && currentTimeVal < 1400) {
      isOpen = true;
      closingInfo = '14:00';
    } else {
      openingInfo = 'el martes a las 09:30';
    }
  } else { // Sunday, Monday (Closed)
    openingInfo = 'el martes a las 09:30';
  }

  if (isOpen) {
    liveStatusBadge.className = 'live-status open';
    liveStatusText.innerHTML = `<span class="status-dot"></span> Abierto ahora • Cierra a las ${closingInfo}`;
  } else {
    liveStatusBadge.className = 'live-status closed';
    liveStatusText.innerHTML = `<span class="status-dot"></span> Cerrado ahora • Abre ${openingInfo}`;
  }
}
