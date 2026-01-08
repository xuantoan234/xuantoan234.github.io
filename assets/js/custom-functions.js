// Custom Academic Website Functions

// Back to Top Button
(function() {
  // Create back to top button
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  // Scroll to top on click
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

// Publication Search and Filter
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPublicationSearch);
  } else {
    initPublicationSearch();
  }

  function initPublicationSearch() {
    const publicationsPage = document.querySelector('.publications-intro');
    if (!publicationsPage) return;

    // Create search and filter controls
    const controls = document.createElement('div');
    controls.className = 'publication-controls';
    controls.innerHTML = `
      <input type="text" 
             class="search-box" 
             placeholder="Search publications by title, author, or keyword..."
             id="pub-search">
      <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="Q1">Q1 Only</button>
        <button class="filter-btn" data-filter="journal">Journals</button>
        <button class="filter-btn" data-filter="conference">Conferences</button>
      </div>
    `;

    // Insert controls after publications intro
    publicationsPage.parentNode.insertBefore(controls, publicationsPage.nextSibling);

    // Get all publication items
    const publications = document.querySelectorAll('.archive__item');

    // Search functionality
    const searchBox = document.getElementById('pub-search');
    if (searchBox) {
      searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        publications.forEach(pub => {
          const text = pub.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            pub.style.display = '';
          } else {
            pub.style.display = 'none';
          }
        });
      });
    }

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        
        publications.forEach(pub => {
          const text = pub.textContent;
          
          if (filter === 'all') {
            pub.style.display = '';
          } else if (filter === 'Q1') {
            pub.style.display = text.includes('Q1') ? '' : 'none';
          } else if (filter === 'journal') {
            // Check if in Journal Articles section
            const section = pub.closest('.page__content').querySelector('h2');
            const isJournal = section && section.textContent.includes('Journal');
            pub.style.display = isJournal ? '' : 'none';
          } else if (filter === 'conference') {
            const section = pub.closest('.page__content').querySelector('h2');
            const isConference = section && section.textContent.includes('Conference');
            pub.style.display = isConference ? '' : 'none';
          }
        });
      });
    });
  }
})();

// Print Publication Statistics
(function() {
  if (window.location.pathname !== '/' && !window.location.pathname.includes('index')) return;
  
  console.log('📊 Publication Statistics:');
  console.log('- Total Journal Articles: 10');
  console.log('- Total Conference Papers: 3');
  console.log('- Q1 Publications: 8');
  console.log('- Q2 Publications: 2');
})();

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// External link indicator
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.hostname.includes(window.location.hostname)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});
