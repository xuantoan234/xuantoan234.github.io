// Gallery functionality for main page
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    loadGalleryFromFolder();
    setupLightbox();
    setupTouchSupport();
    initCherryBlossoms(); // Add cherry blossom effect
});

// Countdown functionality
function initCountdown() {
    const weddingDate = new Date('2026-02-22T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        const messageEl = document.getElementById('countdownMessage');
        
        if (distance < 0) {
            messageEl.textContent = '🎉 The wedding day is here! 🎉';
            messageEl.classList.add('show');
            clearInterval(countdownInterval);
        } else if (days === 0) {
            messageEl.textContent = '✨ The big day is today! ✨';
            messageEl.classList.add('show');
        } else if (days === 1) {
            messageEl.textContent = '💕 Just one more day! 💕';
            messageEl.classList.add('show');
        } else if (days <= 7) {
            messageEl.textContent = '🥂 Less than a week to go! 🥂';
            messageEl.classList.add('show');
        } else if (days <= 30) {
            messageEl.textContent = '💐 The countdown is on! 💐';
            messageEl.classList.add('show');
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Load gallery from Wedding_Photo folder
async function loadGalleryFromFolder() {
    const gallery = document.getElementById('gallery');
    const emptyState = document.getElementById('emptyState');
    
    try {
        // Try to load from photos.json first (static list)
        let imageFiles = [];
        
        try {
            const jsonResponse = await fetch('photos.json');
            if (jsonResponse.ok) {
                imageFiles = await jsonResponse.json();
                console.log(`Loaded ${imageFiles.length} images from photos.json`);
            }
        } catch (jsonError) {
            console.log('photos.json not found, trying PHP...');
        }
        
        
        emptyState.style.display = 'none';
        gallery.style.display = 'grid';
        gallery.innerHTML = '';
        
        imageFiles.forEach((filename, index) => {
            const photoData = {
                src: `Wedding_Photo/${filename}`,
                caption: '',
                index: index
            };
            const item = createGalleryItem(photoData, index);
            gallery.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading photos:', error);
        emptyState.style.display = 'block';
        gallery.style.display = 'none';
        emptyState.innerHTML = `
            <p>Error loading photos.</p>
            <p style="font-size: 0.9rem; color: #999;">
                Make sure photos.json exists or you're running from a web server with PHP support.
            </p>
        `;
    }
}

// Create gallery item
function createGalleryItem(photo, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.index = index;
    
    const img = document.createElement('img');
    img.alt = photo.caption || 'Wedding photo';
    img.loading = 'lazy';
    
    // Check if file is HEIC
    const fileExt = photo.src.split('.').pop().toLowerCase();
    if (fileExt === 'heic' || fileExt === 'heif') {
        // Convert HEIC to displayable format
        convertHEIC(photo.src).then(convertedSrc => {
            img.src = convertedSrc;
        }).catch(error => {
            console.error('Error converting HEIC:', error);
            // Show placeholder if conversion fails
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23ddd" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="20">HEIC not supported</text></svg>';
        });
    } else {
        img.src = photo.src;
    }
    
    // Detect image orientation for better layout
    img.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        
        if (aspectRatio > 1.3) {
            div.classList.add('landscape');
        } else if (aspectRatio < 0.8) {
            div.classList.add('portrait');
        } else {
            div.classList.add('square');
        }
    };
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    
    if (photo.caption) {
        const caption = document.createElement('div');
        caption.className = 'gallery-item-caption';
        caption.textContent = photo.caption;
        overlay.appendChild(caption);
    }
    
    div.appendChild(img);
    div.appendChild(overlay);
    
    // Better touch support
    div.addEventListener('click', () => openLightbox(index));
    div.addEventListener('touchend', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
    
    return div;
}

// Lightbox functionality
let currentImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let allPhotos = [];

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const close = document.getElementById('lightboxClose');
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');

    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', () => navigateLightbox(-1));
    next.addEventListener('click', () => navigateLightbox(1));

    // Touch events for swiping
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next image
            navigateLightbox(1);
        } else {
            // Swiped right - previous image
            navigateLightbox(-1);
        }
    }
}

function openLightbox(index) {
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item img');
    allPhotos = Array.from(galleryItems).map(img => ({
        src: img.src,
        caption: img.alt
    }));
    
    currentImageIndex = index;
    
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    img.src = allPhotos[index].src;
    caption.textContent = allPhotos[index].caption || '';
    
    // Reset image styles to default
    img.style.maxWidth = '90%';
    img.style.maxHeight = '85vh';
    img.style.width = 'auto';
    img.style.height = 'auto';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Prevent body scrolling on iOS
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Restore body scrolling
    document.body.style.position = '';
    document.body.style.width = '';
}

function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + allPhotos.length) % allPhotos.length;
    
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    img.src = allPhotos[currentImageIndex].src;
    caption.textContent = allPhotos[currentImageIndex].caption || '';
    
    // Reset image styles to default
    img.style.maxWidth = '90%';
    img.style.maxHeight = '85vh';
    img.style.width = 'auto';
    img.style.height = 'auto';
}

// Get photos from localStorage
function getPhotosFromStorage() {
    const photosJson = localStorage.getItem('weddingPhotos');
    return photosJson ? JSON.parse(photosJson) : [];
}

// Save photos to localStorage
function savePhotosToStorage(photos) {
    localStorage.setItem('weddingPhotos', JSON.stringify(photos));
}

// Touch support for gallery items
function setupTouchSupport() {
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, a, .gallery-item');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            // Prevent click delay on iOS
            e.preventDefault();
            this.click();
        }, { passive: false });
    });
}

// Optimize image loading for mobile
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe images when they're added to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    imageObserver.observe(node);
                }
            });
        });
    });

    observer.observe(document.getElementById('gallery'));
}

// Convert HEIC to JPEG using heic2any library
async function convertHEIC(heicUrl) {
    try {
        // Load heic2any library if not already loaded
        if (!window.heic2any) {
            await loadScript('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');
        }
        
        // Fetch the HEIC file
        const response = await fetch(heicUrl);
        const blob = await response.blob();
        
        // Convert to JPEG
        const convertedBlob = await heic2any({
            blob: blob,
            toType: 'image/jpeg',
            quality: 0.9
        });
        
        // Create URL for the converted image
        return URL.createObjectURL(convertedBlob);
    } catch (error) {
        throw new Error('Failed to convert HEIC: ' + error.message);
    }
}

// Load external script dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Background Music Control
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = musicToggle.querySelector('.play');
    const pauseIcon = musicToggle.querySelector('.pause');
    let isPlaying = false;

    // Try to autoplay (may be blocked by browser)
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(() => {
            // Autoplay was prevented
            console.log('Autoplay prevented. Click to play music.');
        });
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            bgMusic.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });
});

// Cherry Blossom Petals Animation
function initCherryBlossoms() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;
    
    const petalCount = 30; // Số lượng cánh hoa
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(container, i);
    }
}

function createPetal(container, index) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random position from left
    const leftPosition = Math.random() * 100;
    petal.style.left = leftPosition + '%';
    
    // Random size (smaller petals)
    const size = Math.random() * 6 + 8; // 8-14px
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    // Random animation type
    const animations = ['fall', 'fall-left', 'fall-right'];
    const animationType = animations[Math.floor(Math.random() * animations.length)];
    petal.style.animationName = animationType;
    
    // Random duration (slower = more graceful)
    const duration = Math.random() * 8 + 12; // 12-20 seconds
    petal.style.animationDuration = duration + 's';
    
    // Random delay for staggered effect
    const delay = Math.random() * 10;
    petal.style.animationDelay = delay + 's';
    
    // Infinite loop
    petal.style.animationIterationCount = 'infinite';
    petal.style.animationTimingFunction = 'linear';
    
    // Random opacity variation
    const opacity = Math.random() * 0.3 + 0.5; // 0.5-0.8
    petal.style.setProperty('--petal-opacity', opacity);
    
    container.appendChild(petal);
}
