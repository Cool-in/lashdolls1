document.addEventListener('DOMContentLoaded', () => {
  // Initialize Custom Cursor (only on desktops)
  initCustomCursor();

  // Scroll Actions
  initScrollActions();

  // Mobile Menu triggers (present on all headers)
  initMobileMenu();

  // Services Filter (only on contact.html if services page is merged or filter is present)
  initServicesFilter();

  // Lightbox Gallery (present on index.html and about.html)
  initLightbox();

  // Reviews Carousel (present on index.html)
  initReviewsCarousel();

  // Booking Wizard (present on contact.html)
  initBookingWizard();

  // Live Opening Hours Status (present on contact.html, Dublin timezone)
  updateLiveSalonStatus();
  setInterval(updateLiveSalonStatus, 60000);

  // Shopping Cart Persistence & Drawer Logic (present on all pages)
  initShoppingCart();

  // Academy Syllabus Modals (present on courses.html)
  initAcademyModals();

  // Salon treatments pricing tabs and therapist booking widget (present on about.html)
  initSalonBookingAndTabs();
  initCourseCalendar();
});

/* ==========================================
   1.5 SCROLL ACTIONS (Navbar Header Scrolled toggle)
   ========================================== */
function initScrollActions() {
  const header = document.querySelector('header');
  if (!header) return;

  const isTransparentDefault = header.classList.contains('transparent-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      if (isTransparentDefault) {
        header.classList.remove('transparent-header');
      }
    } else {
      header.classList.remove('scrolled');
      if (isTransparentDefault) {
        header.classList.add('transparent-header');
      }
    }
  });
}

/* ==========================================
   1. CUSTOM CURSOR
   ========================================== */
function initCustomCursor() {
  // Only enable on desktop screens to prevent mobile issues
  if (window.innerWidth <= 1024) return;

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

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const interactiveSelector = 'a, button, .filter-btn, .gallery-item, .review-nav-btn, select, input, textarea, .cart-nav-widget, .cart-drawer-close, .course-modal-close, .qty-btn, .cart-item-remove';
  
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
   2. MOBILE NAVIGATION BURGER MENU
   ========================================== */
function initMobileMenu() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!burgerMenu || !navMenu) return;

  burgerMenu.setAttribute('role', 'button');
  burgerMenu.setAttribute('tabindex', '0');
  burgerMenu.setAttribute('aria-label', 'Open navigation menu');
  burgerMenu.setAttribute('aria-expanded', 'false');

  function setMenuOpen(isOpen) {
    burgerMenu.classList.toggle('open', isOpen);
    navMenu.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    burgerMenu.setAttribute('aria-expanded', String(isOpen));
    burgerMenu.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  burgerMenu.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('open'));
  });

  burgerMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setMenuOpen(!navMenu.classList.contains('open'));
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenuOpen(false);
      burgerMenu.focus();
    }
  });
}

/* ==========================================
   3. SERVICES FILTER
   ========================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (filterBtns.length === 0 || serviceCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

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
   4. LIGHTBOX GALLERY
   ========================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length === 0 || !lightbox) return;

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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
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
   5. REVIEWS CAROUSEL
   ========================================== */
function initReviewsCarousel() {
  const track = document.querySelector('.reviews-track');
  const nextBtn = document.querySelector('.review-nav-btn.next');
  const prevBtn = document.querySelector('.review-nav-btn.prev');
  const cards = document.querySelectorAll('.review-card');
  
  if (!track || cards.length === 0 || !nextBtn || !prevBtn) return;

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
    const gap = 30;
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
  
  // Touch / Swipe controls
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
    
    if (movedBy < -100) {
      const maxIndex = cards.length - getCardsPerView();
      if (currentIndex < maxIndex) currentIndex++;
    } else if (movedBy > 100) {
      if (currentIndex > 0) currentIndex--;
    }
    
    updateCarousel();
    const cardsPerView = getCardsPerView();
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
   6. BOOKING WIZARD & URL PARAMETER ROUTING
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
  
  if (wizardSteps.length === 0 || !serviceSelect) return;

  let currentStepIndex = 0;

  // Smart Query Routing Check on Load
  const urlParams = new URLSearchParams(window.location.search);
  const selectQuery = urlParams.get('select');
  if (selectQuery) {
    // Attempt to set select dropdown directly
    serviceSelect.value = selectQuery;
    
    // Auto-scroll directly to the booking form
    setTimeout(() => {
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStepIndex)) {
        currentStepIndex++;
        updateWizard();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStepIndex--;
      updateWizard();
    });
  });

  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      if (serviceSelect.value === "") {
        alert("Please select a service or course to continue.");
        return false;
      }
    } else if (stepIndex === 1) {
      if (dateInput.value === "" || timeSelect.value === "") {
        alert("Please select a preferred date and time slot.");
        return false;
      }
    } else if (stepIndex === 2) {
      if (nameInput.value.trim() === "" || phoneInput.value.trim() === "") {
        alert("Please input your full name and phone number.");
        return false;
      }
    }
    return true;
  }

  function updateWizard() {
    wizardSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === currentStepIndex);
    });

    stepIndicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === currentStepIndex);
      indicator.classList.toggle('completed', idx < currentStepIndex);
    });

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
    return date.toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitBtn.innerText = "PROCESSING...";
      submitBtn.disabled = true;
      
      setTimeout(() => {
        document.querySelector('.wizard-booking-flow').style.display = 'none';
        document.querySelector('.booking-success').style.display = 'block';
      }, 1500);
    });
  }

  if (dateInput) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}

/* ==========================================
   7. LIVE SALON OPENING HOURS STATUS (Dublin Timezone)
   ========================================== */
function updateLiveSalonStatus() {
  const liveStatusBadge = document.getElementById('live-status-badge');
  const liveStatusText = document.getElementById('live-status-text');
  
  if (!liveStatusBadge || !liveStatusText) return;

  const dublinTimeStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Dublin" });
  const dublinDate = new Date(dublinTimeStr);
  
  const day = dublinDate.getDay(); 
  const hours = dublinDate.getHours();
  const minutes = dublinDate.getMinutes();
  const currentTimeVal = hours * 100 + minutes;

  let isOpen = false;
  let closingInfo = '';
  let openingInfo = '';

  document.querySelectorAll('.hours-row').forEach(row => row.classList.remove('current-day'));
  
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

  if (day >= 2 && day <= 5) {
    if (currentTimeVal >= 930 && currentTimeVal < 1930) {
      isOpen = true;
      closingInfo = '19:30';
    } else {
      openingInfo = 'tomorrow at 09:30';
    }
  } else if (day === 6) {
    if (currentTimeVal >= 930 && currentTimeVal < 1400) {
      isOpen = true;
      closingInfo = '14:00';
    } else {
      openingInfo = 'Tuesday at 09:30';
    }
  } else {
    openingInfo = 'Tuesday at 09:30';
  }

  if (isOpen) {
    liveStatusBadge.className = 'live-status open';
    liveStatusText.innerHTML = `<span class="status-dot"></span> Open now • Closes at ${closingInfo}`;
  } else {
    liveStatusBadge.className = 'live-status closed';
    liveStatusText.innerHTML = `<span class="status-dot"></span> Closed now • Opens ${openingInfo}`;
  }
}

/* ==========================================
   8. SHOPPING CART SYSTEM (Cross-Page localStorage persistence)
   ========================================== */
function initShoppingCart() {
  const cartTrigger = document.getElementById('cart-nav-trigger');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartNavCount = document.getElementById('cart-nav-count');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartTrigger || !cartItemsContainer) return;

  // Load Cart from localStorage on start
  let cart = [];
  try {
    const storedCart = localStorage.getItem('lashdolls_cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error('Error loading cart state:', e);
  }

  // Render initial loaded items
  renderCart();

  // Drawer Toggles
  function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('open');
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('open');
  }

  cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
  });

  // Add Item (bind to product buttons if present on page)
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-product-id');
      const title = btn.getAttribute('data-product-title');
      const price = parseFloat(btn.getAttribute('data-product-price'));
      const img = btn.getAttribute('data-product-img');

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, title, price, img, quantity: 1 });
      }

      saveCartState();
      
      if (cartNavCount) {
        cartNavCount.classList.add('pulse');
        setTimeout(() => cartNavCount.classList.remove('pulse'), 300);
      }

      renderCart();
      openCart();
    });
  });

  // Product Detail Page Quantity Selector Actions
  const detailQtyVal = document.querySelector('.detail-qty-val');
  const detailQtyDec = document.querySelector('.detail-qty-btn.dec-qty');
  const detailQtyInc = document.querySelector('.detail-qty-btn.inc-qty');

  if (detailQtyVal && detailQtyDec && detailQtyInc) {
    detailQtyDec.addEventListener('click', () => {
      let qty = parseInt(detailQtyVal.value) || 1;
      if (qty > 1) {
        detailQtyVal.value = qty - 1;
      }
    });

    detailQtyInc.addEventListener('click', () => {
      let qty = parseInt(detailQtyVal.value) || 1;
      detailQtyVal.value = qty + 1;
    });
  }

  // Product Detail Page Add To Cart Button Actions
  const addDetailToCartBtn = document.querySelector('.add-detail-to-cart-btn');
  if (addDetailToCartBtn && detailQtyVal) {
    addDetailToCartBtn.addEventListener('click', () => {
      const id = addDetailToCartBtn.getAttribute('data-product-id');
      const title = addDetailToCartBtn.getAttribute('data-product-title');
      const price = parseFloat(addDetailToCartBtn.getAttribute('data-product-price'));
      const img = addDetailToCartBtn.getAttribute('data-product-img');
      const qty = parseInt(detailQtyVal.value) || 1;

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.push({ id, title, price, img, quantity: qty });
      }

      saveCartState();

      if (cartNavCount) {
        cartNavCount.classList.add('pulse');
        setTimeout(() => cartNavCount.classList.remove('pulse'), 300);
      }

      renderCart();
      openCart();
    });
  }

  function saveCartState() {
    try {
      localStorage.setItem('lashdolls_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart state:', e);
    }
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <i class="fas fa-shopping-bag"></i>
          <p>Your bag is currently empty.</p>
        </div>
      `;
      if (cartNavCount) cartNavCount.innerText = '0';
      if (cartSubtotalVal) cartSubtotalVal.innerText = '€0.00';
      return;
    }

    let cartHTML = '';
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.price * item.quantity;

      cartHTML += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-title">${item.title}</h4>
              <span class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <span class="qty-btn dec-qty">-</span>
                <span class="qty-val">${item.quantity}</span>
                <span class="qty-btn inc-qty">+</span>
              </div>
              <span class="cart-item-remove">Remove</span>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    if (cartNavCount) cartNavCount.innerText = totalItems;
    if (cartSubtotalVal) cartSubtotalVal.innerText = `€${subtotal.toFixed(2)}`;

    initCartItemListeners();
  }

  function initCartItemListeners() {
    cartItemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.cart-item').getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCartState();
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.cart-item').getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCartState();
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.cart-item').getAttribute('data-id');
        cart = cart.filter(i => i.id !== id);
        saveCartState();
        renderCart();
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
      }
      alert("Thank you for shopping with LashDolls! This checkout is simulated. E-commerce systems are fully ready for integration.");
      cart = [];
      saveCartState();
      renderCart();
      closeCart();
    });
  }
}

/* ==========================================
   9. ACADEMY MODALS & REDIRECTION ROUTING
   ========================================== */
function initAcademyModals() {
  const courseModalOverlay = document.getElementById('course-modal-overlay');
  const courseModal = document.getElementById('course-modal');
  const courseModalClose = document.getElementById('course-modal-close');
  const modalTitle = document.getElementById('modal-course-title');
  const modalBody = document.getElementById('modal-course-body');
  const modalPrice = document.getElementById('modal-course-price');
  const modalEnrolBtn = document.getElementById('modal-enrol-btn');

  if (!courseModalOverlay || !modalTitle) return;

  const courseSyllabuses = {
        "russian-volume-course": {
      title: "Advanced Russian Volume Lash Course",
      price: "€450.00",
      selectId: "russian-volume-course",
      sections: [
        {
          title: "Volume Theoretical Principles",
          items: [
            "Russian Volume fan geometry calculations",
            "Lash safety weight multiplier limits (2D-10D)",
            "Volume adhesive curing speeds and moisture levels",
            "Styling maps matching natural face symmetries"
          ]
        },
        {
          title: "Volume Practical Artistry",
          items: [
            "Precision volume fan formation (pinch & roll method)",
            "Safety isolation weights with multiple fans",
            "Retention wrapping techniques",
            "Wispy/Kim-K mappings and styling depth finishes"
          ]
        }
      ],
      kit: "Elite Volume Lash Glue, 3 Russian Volume mixed cashmeres trays, specialized megavolume pick tweezers, mapping pads, glue shields, and sponge boards."
    },
        "styling-course": {
      title: "Master Lash Artistry & Styling Course",
      price: "€350.00",
      selectId: "styling-course",
      sections: [
        {
          title: "Advanced Artistry Principles",
          items: [
            "Lash layers mapping geometries (top, mid, bottom)",
            "Wispy & Kim-K styling setups parameters",
            "Speed lashing techniques & gap bridges styling"
          ]
        },
        {
          title: "Eye Shapes Configuration",
          items: [
            "Monolids, hooded eyes, deep-sets, down-turned eyes styling",
            "Client eye corrections parameters & photogenic mappings"
          ]
        }
      ],
      kit: "Styling mapping guide pads, 2 mixed Wispy lash trays, speed-bonding lash primer, fast-cure volume glue, and accessory styling pins."
    },
    "brow-course": {
      title: "Ultimate Brow Lamination Course",
      price: "€200.00",
      selectId: "brow-course",
      sections: [
        {
          title: "Lamination Science",
          items: [
            "Perming lotion timing guidelines per hair texture",
            "Precision thread mapping & facial structures guidelines"
          ]
        },
        {
          title: "Tint & Shaping finishes",
          items: [
            "Formulating custom hybrid tint shades & depths",
            "Waxing borders finishing, trimming, styling textures"
          ]
        }
      ],
      kit: "Professional lamination cream kit, mapping thread coils, shaping wax sheets, tint developer solutions, and styling combs."
    },
    "classic-hybrid": {
      title: "Beginners Classic & Hybrid Lash Course",
      price: "€450.00",
      selectId: "classic-hybrid-course",
      sections: [
        {
          title: "Theoretical Modules",
          items: [
            "Introduction to Eyelash Extensions structure",
            "Anatomy and physiology of the human eye & natural lashes",
            "Health, sanitation, hygiene, and counter safety",
            "Curing science and adhesive chemical composition",
            "Customer consultation, patch testing, and record forms"
          ]
        },
        {
          title: "Practical Modules",
          items: [
            "Application techniques (isolation, mapping, pickup, placement)",
            "Length, curl, and weight mapping styling parameters",
            "Custom hybrid fan blending technique",
            "Extension infills, client maintenance guide, and safe removals",
            "Social media tips, insurance configuration, and booking engines"
          ]
        }
      ],
      kit: "Full ABT Accredited Certificate, No.1 Lash Glue, 2 Cashmere Lash trays, high-precision isolation tweezers, lash primer, lash shampoo cleanser, and accessories bag."
    },
    "lift-brow-combo": {
      title: "Lash Lift & Brow Combo Course",
      price: "€250.00",
      selectId: "lift-brow-combo",
      sections: [
        {
          title: "Lash Lifting Modules",
          items: [
            "Lash structures, chemical timers, and lotion selections",
            "Silicone shield sizes selection and placement mapping",
            "Lash lift solution timing guidelines",
            "Deep tint application and mascara effect styling"
          ]
        },
        {
          title: "Brow Lamination Modules",
          items: [
            "Lamination lotion application rules and precautions",
            "Brow hair mapping, brushing architectures, and restructuring",
            "Tint custom shade matching and depth creation",
            "Brow waxing, tweezing shapes, and thread borders finishing"
          ]
        }
      ],
      kit: "Full CPD Accredited Certificate, Korean lift perm lotions box, lifting adhesive glue, silicon rods sets, brow shaping wax papers, tints, and lash brushes pack."
    },
    "train-trainer": {
      title: "Train The Trainer Professional",
      price: "€650.00",
      selectId: "train-trainer-course",
      sections: [
        {
          title: "Education Curriculums",
          items: [
            "Developing student manuals and training lesson models",
            "Setting assessment scales, scores, and evaluation models",
            "Structuring practical demonstration modules",
            "Securing insurance permissions and ABT/CPD training credentials"
          ]
        },
        {
          title: "Academy Leadership",
          items: [
            "Creating course pricing, dates scheduling, and client engines",
            "Student acquisition channels, business scales, and kit sourcing",
            "Public speaking, classroom management, and student mentorship support"
          ]
        }
      ],
      kit: "Certified Educator License, editable master student manual templates (.docx), student progress checklists, and lash trainer support documents kit."
    }
  };

  document.querySelectorAll('.view-syllabus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const syllabus = courseSyllabuses[courseId];
      if (!syllabus) return;

      modalTitle.innerText = syllabus.title;
      modalPrice.innerText = syllabus.price;
      modalEnrolBtn.setAttribute('data-course-select', syllabus.selectId);

      let bodyHTML = '';
      syllabus.sections.forEach(sec => {
        bodyHTML += `<h4 class="syllabus-section-title">${sec.title}</h4><ul class="syllabus-list">`;
        sec.items.forEach(item => {
          bodyHTML += `<li class="syllabus-item"><i class="fas fa-check-circle"></i> <span>${item}</span></li>`;
        });
        bodyHTML += `</ul>`;
      });

      bodyHTML += `
        <div class="syllabus-kit-box">
          <h4>What's in your Master Kit:</h4>
          <p>${syllabus.kit}</p>
        </div>
      `;

      modalBody.innerHTML = bodyHTML;
      courseModalOverlay.classList.add('active');
    });
  });

  function closeModal() {
    courseModalOverlay.classList.remove('active');
  }

  if (courseModalClose) courseModalClose.addEventListener('click', closeModal);
  courseModalOverlay.addEventListener('click', (e) => {
    if (e.target === courseModalOverlay) closeModal();
  });

  // Multi-page Enrol action redirection routing
  const enrolButtons = document.querySelectorAll('.enrol-course-btn, #modal-enrol-btn');
  enrolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseSelectVal = btn.getAttribute('data-course-select');
      if (courseSelectVal) {
        closeModal();
        // Redirect to contact page with course parameter pre-loaded
        window.location.href = `contact.html?select=${courseSelectVal}`;
      }
    });
  });
}

/* ==========================================
   11. SALON TREATMENTS TABS & LOCATION-AWARE BOOKING
   ========================================== */
function initSalonBookingAndTabs() {
  // Salon Treatments tabs switcher
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tabId = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const activeContent = document.getElementById(tabId);
        if (activeContent) activeContent.classList.add('active');
      });
    });
  }

  // Booking Widget Steps & Elements
  const stepLocation = document.getElementById('step-location');
  const stepTherapist = document.getElementById('step-therapist');
  const stepTreatment = document.getElementById('step-treatment');
  const stepSchedule = document.getElementById('step-schedule');
  const stepContact = document.getElementById('step-contact');

  const locationCards = document.querySelectorAll('.location-card');
  const therapistContainer = document.getElementById('therapist-container');
  const calendarDaysContainer = document.getElementById('calendar-days-container');
  const timeSlots = document.querySelectorAll('.time-slot');
  const bookingForm = document.getElementById('salon-booking-form');

  if (!locationCards.length || !therapistContainer) return; // Exit if not on about.html

  // Data Definition
  const staffByLocation = {
    Ratoath: [
      { name: "Linda", desc: "Lash tech, Brow artist, nail technician", initial: "L" },
      { name: "Niamh", desc: "Lash Technician, Brow tech, Beauty Educator & Piercer", initial: "N" },
      { name: "Andrea", desc: "Nail Technician", initial: "A" },
      { name: "Aoife Keller", desc: "Stylist", initial: "AK", isIcon: true },
      { name: "Leona", desc: "Staff", initial: "L", isIcon: true }
    ],
    Warehouse: [
      { name: "Niamh", desc: "Lash Technician, Brow tech, Beauty Educator & Piercer", initial: "N" },
      { name: "Aoife", desc: "Stylist", initial: "A", isIcon: true }
    ]
  };

  // State
  let activeLocation = "Ratoath";
  let activeTherapist = null;
  let activeTreatment = null;
  let activePrice = null;
  
  let currentYear = 2026;
  let currentMonth = 6; // July (0-indexed)
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  let selectedYear = null;
  let selectedMonth = null;
  let selectedDate = null;
  let selectedTimeSlot = null;

  // Function to render Therapists based on Location
  function renderTherapists(location) {
    const therapists = staffByLocation[location];
    let html = "";
    therapists.forEach(t => {
      const avatarClass = t.isIcon ? "outline-avatar" : "badge-avatar";
      const avatarContent = t.isIcon ? `<i class="fas fa-user"></i>` : t.initial;
      
      html += `
        <div class="tech-card" data-tech="${t.name}">
          <div class="tech-avatar ${avatarClass}">${avatarContent}</div>
          <div class="tech-info">
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
          </div>
          <div class="select-indicator"><i class="fas fa-check"></i></div>
        </div>
      `;
    });
    
    // Add "Any Therapist" card
    html += `
      <div class="tech-card" data-tech="Anyone">
        <div class="tech-avatar anyone-avatar"><i class="fas fa-magic"></i></div>
        <div class="tech-info">
          <h4>Any Therapist</h4>
          <p>Select for maximum scheduling availability</p>
        </div>
        <div class="select-indicator"><i class="fas fa-check"></i></div>
      </div>
    `;
    
    therapistContainer.innerHTML = html;

    // Re-bind click event to tech cards
    therapistContainer.querySelectorAll('.tech-card').forEach(card => {
      card.addEventListener('click', () => {
        therapistContainer.querySelectorAll('.tech-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        activeTherapist = card.getAttribute('data-tech');
        
        // Unlock Step 3
        if (stepTreatment) {
          stepTreatment.classList.remove('locked');
        }
      });
    });
  }

  // Custom Calendar Generator
  function drawCalendar() {
    if (!calendarDaysContainer) return;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();
    // Monday is start of week in M T W T F S S
    const paddingDays = startDay === 0 ? 6 : startDay - 1;
    const totalCells = Math.ceil((paddingDays + daysInMonth) / 7) * 7;
    
    document.getElementById('calendar-month-year').innerText = `${monthNames[currentMonth]} ${currentYear}`;
    
    let html = "";
    
    // 1. Padding days
    for (let i = 0; i < paddingDays; i++) {
      html += '<span class="calendar-day disabled"></span>';
    }
    
    // 2. Clickable Days
    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    
    for (let day = 1; day <= daysInMonth; day++) {
      let isPast = false;
      
      if (currentYear < todayYear) {
        isPast = true;
      } else if (currentYear === todayYear) {
        if (currentMonth < todayMonth) {
          isPast = true;
        } else if (currentMonth === todayMonth) {
          if (day < todayDay) {
            isPast = true;
          }
        }
      }
      
      const classStr = isPast ? 'calendar-day disabled' : 'calendar-day';
      const activeClass = (selectedDate === day && selectedMonth === currentMonth && selectedYear === currentYear) ? ' active' : '';
      
      html += `<span class="${classStr}${activeClass}" data-day="${day}">${day}</span>`;
    }
    
    // 3. Ending padding
    const endPadding = totalCells - (paddingDays + daysInMonth);
    for (let i = 0; i < endPadding; i++) {
      html += '<span class="calendar-day disabled"></span>';
    }
    
    calendarDaysContainer.innerHTML = html;
  }

  // Initialize
  renderTherapists("Ratoath");

  // Location Cards Click handler
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      locationCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeLocation = card.getAttribute('data-location');
      
      // Reset subsequent steps
      activeTherapist = null;
      activeTreatment = null;
      selectedDate = null;
      selectedTimeSlot = null;
      
      if (stepTreatment) stepTreatment.classList.add('locked');
      if (stepSchedule) stepSchedule.classList.add('locked');
      if (stepContact) stepContact.classList.add('locked');
      
      // Clear treatment selection row highlights
      document.querySelectorAll('.menu-item-row').forEach(row => {
        row.classList.remove('selected-treatment-row');
        const btn = row.querySelector('.book-service-btn');
        if (btn) btn.innerHTML = "<span>Select</span>";
      });

      renderTherapists(activeLocation);
    });
  });

  // Bind Treatment Selection click listeners
  const treatmentSelectButtons = document.querySelectorAll('.book-service-btn');
  treatmentSelectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Mark active row
      document.querySelectorAll('.menu-item-row').forEach(row => {
        row.classList.remove('selected-treatment-row');
        const b = row.querySelector('.book-service-btn');
        if (b) b.innerHTML = "<span>Select</span>";
      });
      
      const parentRow = btn.closest('.menu-item-row');
      if (parentRow) {
        parentRow.classList.add('selected-treatment-row');
      }
      
      btn.innerHTML = "<span>Selected ✔</span>";
      
      activeTreatment = btn.getAttribute('data-service');
      activePrice = btn.getAttribute('data-price');
      
      // Unlock Step 4 (Schedule)
      if (stepSchedule) {
        stepSchedule.classList.remove('locked');
        drawCalendar();
      }
    });
  });

  // Calendar click delegation
  if (calendarDaysContainer) {
    calendarDaysContainer.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('calendar-day') && !target.classList.contains('disabled')) {
        calendarDaysContainer.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
        target.classList.add('active');
        
        selectedDate = parseInt(target.getAttribute('data-day'));
        selectedMonth = currentMonth;
        selectedYear = currentYear;

        checkScheduleCompletion();
      }
    });
  }

  // Month Switchers
  const prevMonthBtn = document.getElementById('calendar-prev-month');
  const nextMonthBtn = document.getElementById('calendar-next-month');
  
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const today = new Date();
      if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
        return;
      }
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      drawCalendar();
    });

    nextMonthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      drawCalendar();
    });
  }

  // Time Slot Selection
  if (timeSlots.length > 0) {
    timeSlots.forEach(slot => {
      slot.addEventListener('click', (e) => {
        e.preventDefault();
        timeSlots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
        selectedTimeSlot = slot.getAttribute('data-time');
        
        checkScheduleCompletion();
      });
    });
  }

  function checkScheduleCompletion() {
    if (selectedDate && selectedTimeSlot) {
      if (stepContact) {
        stepContact.classList.remove('locked');
      }
    }
  }

  // Submit appointment alert
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = activeTreatment || "Classic Refills";
      const tech = activeTherapist || "Anyone";
      const date = selectedDate || "12";
      const monthStr = monthNames[selectedMonth || currentMonth];
      const time = selectedTimeSlot || "09:30 AM";
      const name = document.getElementById('booking-name').value;
      const locText = activeLocation === "Ratoath" ? "Lash Dolls Ratoath" : "The Secret Warehouse";
      
      alert(`Thank you, ${name}! Your booking for "${service}" (${activePrice || '€50'}) at ${locText} with therapist ${tech} on ${monthStr} ${date}th at ${time} is successfully reserved! A confirmation email and deposit invoice (€20) have been sent.`);
      bookingForm.reset();
      
      // Lock wizard again
      activeTherapist = null;
      activeTreatment = null;
      selectedDate = null;
      selectedTimeSlot = null;
      
      document.querySelectorAll('.menu-item-row').forEach(row => {
        row.classList.remove('selected-treatment-row');
        const b = row.querySelector('.book-service-btn');
        if (b) b.innerHTML = "<span>Select</span>";
      });
      document.querySelectorAll('.tech-card').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
      
      if (stepTreatment) stepTreatment.classList.add('locked');
      if (stepSchedule) stepSchedule.classList.add('locked');
      if (stepContact) stepContact.classList.add('locked');
      
      window.scrollTo({ top: document.getElementById('book-appointment').offsetTop, behavior: 'smooth' });
    });
  }

  // Variant selection pill toggle
  document.querySelectorAll('.variant-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const container = pill.parentElement;
      container.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* ==========================================
   12. MINI COURSE DETAIL CALENDAR GENERATOR
   ========================================== */
function initCourseCalendar() {
  const calendarContainer = document.getElementById('course-calendar-days-container');
  const monthYearLabel = document.getElementById('course-calendar-month-year');
  const prevBtn = document.getElementById('course-calendar-prev-month');
  const nextBtn = document.getElementById('course-calendar-next-month');
  const dateIndicator = document.querySelector('.selected-date-indicator');
  const dateText = document.getElementById('selected-course-date-text');
  const enrolBtn = document.querySelector('.variant-section .btn-primary');

  if (!calendarContainer || !monthYearLabel) return;

  let year = 2026;
  let month = 6; // July (0-indexed)
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  let selectedDay = null;

  // Initially lock the Enrol button until a date is chosen
  if (enrolBtn) {
    enrolBtn.style.opacity = "0.5";
    enrolBtn.style.pointerEvents = "none";
  }

  function draw() {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    const paddingDays = startDay === 0 ? 6 : startDay - 1;
    const totalCells = Math.ceil((paddingDays + daysInMonth) / 7) * 7;
    
    monthYearLabel.innerText = `${months[month]} ${year}`;
    
    let html = "";
    for (let i = 0; i < paddingDays; i++) {
      html += '<span class="calendar-day disabled"></span>';
    }
    
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      let isPast = false;
      if (year < today.getFullYear()) {
        isPast = true;
      } else if (year === today.getFullYear()) {
        if (month < today.getMonth()) {
          isPast = true;
        } else if (month === today.getMonth()) {
          if (day < today.getDate()) {
            isPast = true;
          }
        }
      }
      
      const activeClass = (selectedDay === day) ? ' active' : '';
      const classStr = isPast ? 'calendar-day disabled' : 'calendar-day';
      html += `<span class="${classStr}${activeClass}" data-day="${day}">${day}</span>`;
    }
    
    const endPadding = totalCells - (paddingDays + daysInMonth);
    for (let i = 0; i < endPadding; i++) {
      html += '<span class="calendar-day disabled"></span>';
    }
    
    calendarContainer.innerHTML = html;
  }

  calendarContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('calendar-day') && !target.classList.contains('disabled')) {
      calendarContainer.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
      target.classList.add('active');
      selectedDay = parseInt(target.getAttribute('data-day'));
      
      if (dateIndicator && dateText) {
        dateIndicator.style.display = "block";
        dateText.innerText = `${months[month]} ${selectedDay}, ${year}`;
      }
      
      if (enrolBtn) {
        enrolBtn.style.opacity = "1";
        enrolBtn.style.pointerEvents = "auto";
        const baseHref = enrolBtn.getAttribute('href').split('&')[0];
        enrolBtn.setAttribute('href', `${baseHref}&date=${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`);
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth()) return;
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      selectedDay = null;
      if (enrolBtn) {
        enrolBtn.style.opacity = "0.5";
        enrolBtn.style.pointerEvents = "none";
      }
      if (dateIndicator) dateIndicator.style.display = "none";
      draw();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      selectedDay = null;
      if (enrolBtn) {
        enrolBtn.style.opacity = "0.5";
        enrolBtn.style.pointerEvents = "none";
      }
      if (dateIndicator) dateIndicator.style.display = "none";
      draw();
    });
  }

  draw();
}
