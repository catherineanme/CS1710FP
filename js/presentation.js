// ===== PRESENTATION MODE NAVIGATION =====

// Presentation state
let currentPage = 0;
let totalPages = 0;
let isTransitioning = false;
let pageInitialized = {};

// Initialize presentation
function initPresentation() {
  // Add presentation mode class to body
  document.body.classList.add('presentation-mode');
  
  // Get all pages
  const pages = document.querySelectorAll('.page');
  totalPages = pages.length;
  
  // Show first page
  if (pages.length > 0) {
    pages[0].classList.add('active');
    currentPage = 0;
  }
  
  // Initialize UI
  updatePageIndicator();
  updateProgressBar();
  updatePageDots();
  updateNavigationButtons();
  
  // Wait for data to be ready before initializing content
  if (window.dataLoaded) {
    initPageContent(0);
  } else {
    window.addEventListener('dataReady', () => {
      initPageContent(0);
    }, { once: true });
  }
  
}

// Navigation functions
function goToPage(pageNumber) {
  if (pageNumber < 0 || pageNumber >= totalPages || isTransitioning) return;
  if (pageNumber === currentPage) return;
  
  isTransitioning = true;
  
  const currentPageEl = document.querySelector('.page.active');
  const nextPageEl = document.querySelector(`.page[data-page="${pageNumber}"]`);
  
  if (!currentPageEl || !nextPageEl) {
    isTransitioning = false;
    return;
  }
  
  const goingForward = pageNumber > currentPage;
  
  // Clean up any lingering transition classes from all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('exit-left', 'exit-right', 'to-left', 'no-transition');
  });
  
  // Step 1: Position the incoming page on the correct side (instantly, no transition)
  nextPageEl.classList.add('no-transition');
  
  if (goingForward) {
    // New page enters from the right (default position, just ensure it's there)
    nextPageEl.classList.remove('to-left');
  } else {
    // New page enters from the left
    nextPageEl.classList.add('to-left');
  }
  
  // Force reflow to apply the instant positioning
  nextPageEl.offsetHeight;
  
  // Step 2: Remove no-transition so subsequent changes animate
  nextPageEl.classList.remove('no-transition');
  
  // Small delay to ensure the browser has processed the position
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Step 3: Start the exit animation on current page
      if (goingForward) {
        currentPageEl.classList.add('exit-left');
      } else {
        currentPageEl.classList.add('exit-right');
      }
      currentPageEl.classList.remove('active');
      
      // Step 4: Start the enter animation on new page
      nextPageEl.classList.remove('to-left');
      nextPageEl.classList.add('active');
      
      // Update current page tracker
      currentPage = pageNumber;
      
      // Update UI immediately
      updatePageIndicator();
      updateProgressBar();
      updatePageDots();
      updateNavigationButtons();
      
      // Initialize page content if not already initialized
      initPageContent(pageNumber);
      
      // Invalidate any Leaflet maps on the page after transition completes
      setTimeout(() => {
        const maps = nextPageEl.querySelectorAll('.leaflet-container');
        maps.forEach((mapContainer) => {
          const mapId = mapContainer.id;
          if (window[mapId + 'Instance']) {
            window[mapId + 'Instance'].invalidateSize();
          }
        });
        
        // Clean up exit classes from old page
        currentPageEl.classList.remove('exit-left', 'exit-right');
        
        // Reset transition flag
        isTransitioning = false;
      }, 550);
    });
  });
}

function nextPage() {
  if (currentPage < totalPages - 1) {
    goToPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 0) {
    goToPage(currentPage - 1);
  }
}

// Update UI elements
function updatePageIndicator() {
  const currentEl = document.querySelector('.current-page');
  const totalEl = document.querySelector('.total-pages');
  
  if (currentEl) currentEl.textContent = currentPage + 1;
  if (totalEl) totalEl.textContent = totalPages;
}

function updateProgressBar() {
  const progressBar = document.querySelector('.page-progress-fill');
  if (progressBar) {
    const progress = ((currentPage + 1) / totalPages) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function updatePageDots() {
  document.querySelectorAll('.page-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPage);
  });
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
}

// Initialize page-specific content (maps, charts, etc.)
function initPageContent(pageNumber) {
  // Skip if already initialized
  if (pageInitialized[pageNumber]) return;
  
  if (!window.dataLoaded) return;
  
  const page = document.querySelector(`.page[data-page="${pageNumber}"]`);
  if (!page) return;
  
  // Initialize based on page number
  switch(pageNumber) {
    case 0:
      // Title page - no initialization needed
      break;
    case 1:
      // Introduction - no maps/charts
      break;
    case 2:
      if (typeof createMap1 === 'function') setTimeout(() => createMap1(), 300);
      break;
    case 3:
      if (typeof createClosestRacesChart === 'function') setTimeout(() => createClosestRacesChart(), 300);
      break;
    case 4:
      if (typeof createMap3 === 'function') {
        setTimeout(() => {
          createMap3();
          if (typeof createTargetConstituencies === 'function') createTargetConstituencies();
        }, 300);
      }
      break;
    case 5:
      if (typeof createMap4 === 'function') setTimeout(() => createMap4(), 300);
      break;
    case 6:
      if (typeof createShiftMap === 'function') setTimeout(() => createShiftMap(), 300);
      break;
    case 7:
      if (typeof createCoalitionMap === 'function') setTimeout(() => createCoalitionMap(), 300);
      break;
    case 8:
      if (typeof createMarginBeeswarm === 'function') setTimeout(() => createMarginBeeswarm(), 300);
      break;
    case 9:
      if (typeof createENPHeatmap === 'function') setTimeout(() => createENPHeatmap(), 300);
      break;
    case 10:
      if (typeof createScenariosDashboard === 'function') setTimeout(() => createScenariosDashboard(), 300);
      break;
    case 11:
      if (typeof createRegionalTreemap === 'function') {
        setTimeout(() => {
          createRegionalTreemap();
          if (typeof setupTreemapYearSelector === 'function') setupTreemapYearSelector();
        }, 300);
      }
      break;
  }
  
  // Mark as initialized
  pageInitialized[pageNumber] = true;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Ignore if typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  // Ignore if modal is open
  if (document.querySelector('.shortcuts-modal.active')) return;
  
  switch(e.key) {
    case 'ArrowRight':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      nextPage();
      break;
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault();
      prevPage();
      break;
    case 'Home':
      e.preventDefault();
      goToPage(0);
      break;
    case 'End':
      e.preventDefault();
      goToPage(totalPages - 1);
      break;
    case 'Escape':
      // Close any open modals
      const modal = document.querySelector('.shortcuts-modal.active');
      if (modal) modal.classList.remove('active');
      break;
  }
  
  // Number keys for direct page access (1-9, 0)
  if (e.key >= '0' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
    const pageNum = e.key === '0' ? 9 : parseInt(e.key) - 1;
    if (pageNum < totalPages) {
      e.preventDefault();
      goToPage(pageNum);
    }
  }
});

// Button event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Navigation buttons
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  
  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  
  // Page dots
  document.querySelectorAll('.page-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => goToPage(index));
  });
  
  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', () => goToPage(1));
});

// Touch/Swipe navigation
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 75;
  const horizontalDiff = touchEndX - touchStartX;
  const verticalDiff = Math.abs(touchEndY - touchStartY);
  
  // Only trigger if horizontal swipe is dominant
  if (verticalDiff < 100) {
    if (horizontalDiff < -swipeThreshold) {
      nextPage(); // Swipe left
    } else if (horizontalDiff > swipeThreshold) {
      prevPage(); // Swipe right
    }
  }
}

// Mouse wheel navigation (optional)
let wheelTimeout;
document.addEventListener('wheel', (e) => {
  // Ignore if scrolling within a page
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.scrollHeight > activePage.clientHeight) {
    // Allow normal scrolling
    return;
  }
  
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 30) {
      nextPage();
    } else if (e.deltaY < -30) {
      prevPage();
    }
  }, 150);
}, { passive: true });

// URL hash navigation
function updateHash() {
  window.location.hash = `page-${currentPage}`;
}

function checkHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#page-')) {
    const pageNum = parseInt(hash.replace('#page-', ''));
    if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages) {
      goToPage(pageNum);
    }
  }
}

// Export functions for use in other scripts (do this early)
// Note: We export the wrapper functions that include hash updates
window.presentationNav = {
  goToPage: (pageNumber) => {
    goToPage(pageNumber);
    updateHash();
  },
  nextPage,
  prevPage,
  getCurrentPage: () => currentPage,
  getTotalPages: () => totalPages
};

// Check hash on load
window.addEventListener('hashchange', checkHash);
window.addEventListener('load', () => {
  initPresentation();
  checkHash();
});

