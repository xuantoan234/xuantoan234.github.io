// Gallery functionality for main page
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    loadGalleryFromFolder();
    setupLightbox();
    setupTouchSupport();
    initCherryBlossoms();
    initMusicPlayer(); // Initialize music player
});

// Music Player Control
function initMusicPlayer() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = musicToggle.querySelector('.play-icon');
    const pauseIcon = musicToggle.querySelector('.pause-icon');
    
    if (!bgMusic || !musicToggle) {
        console.error('Music elements not found');
        return;
    }
    
    let isPlaying = false;
    
    // Hide pause icon initially
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'block';
    
    // Attempt to autoplay immediately
    function attemptAutoplay() {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                isPlaying = true;
                console.log('Music auto-playing');
            }).catch(error => {
                console.log('Autoplay prevented by browser:', error.message);
                console.log('User interaction required. Please click the play button.');
            });
        }
    }
    
    // Try autoplay on page load
    attemptAutoplay();
    
    // Try autoplay on first user interaction (fallback)
    const tryPlayOnInteraction = () => {
        if (!isPlaying) {
            attemptAutoplay();
        }
    };
    
    // Listen for various user interactions
    document.addEventListener('click', tryPlayOnInteraction, { once: true });
    document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
    document.addEventListener('scroll', tryPlayOnInteraction, { once: true });
    document.addEventListener('mousemove', tryPlayOnInteraction, { once: true });
    
    // Music toggle click handler
    musicToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isPlaying) {
            bgMusic.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            isPlaying = false;
            console.log('Music paused');
        } else {
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    isPlaying = true;
                    console.log('Music playing');
                }).catch(error => {
                    console.error('Playback failed:', error);
                    alert('Không thể phát nhạc. Vui lòng kiểm tra file nhạc.');
                });
            }
        }
    });
    
    // Update button state when audio plays/pauses
    bgMusic.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        isPlaying = true;
    });
    
    bgMusic.addEventListener('pause', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
    });
}

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

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p class="countdown-message">Chúc mừng ngày vui! 🎉</p>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Load gallery from Wedding_Photo folder
async function loadGalleryFromFolder() {
    const gallery = document.getElementById('gallery');
    const emptyState = document.getElementById('emptyState');
    
    if (!gallery) return;
    
    try {
        // Try to load from photos.json
        const response = await fetch('photos.json');
        if (!response.ok) {
            throw new Error('photos.json not found');
        }
        
        const imageFiles = await response.json();
        
        if (imageFiles.length === 0) {
            emptyState.style.display = 'block';
            gallery.style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        gallery.style.display = 'grid';
        gallery.innerHTML = '';
        
        imageFiles.forEach((filename, index) => {
            const item = createGalleryItem({
                src: `Wedding_Photo/${filename}`,
                caption: '',
                index: index
            }, index);
            gallery.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error loading photos:', error);
        emptyState.style.display = 'block';
        gallery.style.display = 'none';
    }
}

// Create gallery item
function createGalleryItem(photo, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = `Wedding photo ${index + 1}`;
    img.loading = 'lazy';
    
    img.onclick = () => openLightbox(index);
    
    div.appendChild(img);
    return div;
}

// Lightbox functionality
let currentImageIndex = 0;
let allPhotos = [];

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (closeBtn) closeBtn.onclick = closeLightbox;
    if (prevBtn) prevBtn.onclick = () => navigateLightbox(-1);
    if (nextBtn) nextBtn.onclick = () => navigateLightbox(1);
    
    if (lightbox) {
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (!lightbox || !lightboxImg || galleryItems.length === 0) return;
    
    currentImageIndex = index;
    allPhotos = Array.from(galleryItems).map(img => img.src);
    
    lightboxImg.src = allPhotos[index];
    lightboxCaption.textContent = `${index + 1} / ${allPhotos.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = allPhotos.length - 1;
    } else if (currentImageIndex >= allPhotos.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (lightboxImg && allPhotos[currentImageIndex]) {
        lightboxImg.src = allPhotos[currentImageIndex];
        lightboxCaption.textContent = `${currentImageIndex + 1} / ${allPhotos.length}`;
    }
}

// Touch support for gallery items
function setupTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            navigateLightbox(1); // Swipe left
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            navigateLightbox(-1); // Swipe right
        }
    }
}

// Cherry Blossom Petals Animation
function initCherryBlossoms() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;
    
    const petalCount = 30;
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(container, i);
    }
}

function createPetal(container, index) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const leftPosition = Math.random() * 100;
    petal.style.left = leftPosition + '%';
    
    const size = Math.random() * 6 + 8;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    const animations = ['fall', 'fall-left', 'fall-right'];
    const animationType = animations[Math.floor(Math.random() * animations.length)];
    petal.style.animationName = animationType;
    
    const duration = Math.random() * 8 + 12;
    petal.style.animationDuration = duration + 's';
    
    const delay = Math.random() * 10;
    petal.style.animationDelay = delay + 's';
    
    petal.style.animationIterationCount = 'infinite';
    petal.style.animationTimingFunction = 'linear';
    
    container.appendChild(petal);
}

// Toggle Envelope Animation
function toggleEnvelope(envelope) {
    const isOpened = envelope.classList.contains('opened');
    
    // Close all other envelopes
    document.querySelectorAll('.letter-envelope.opened').forEach(env => {
        if (env !== envelope) {
            env.classList.remove('opened');
        }
    });
    
    // Toggle current envelope
    if (isOpened) {
        envelope.classList.remove('opened');
    } else {
        envelope.classList.add('opened');
        
        // Scroll into view smoothly
        setTimeout(() => {
            envelope.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
    
    // Prevent event bubbling
    event.stopPropagation();
}

// Close envelope when clicking close button
document.addEventListener('click', function(e) {
    const letterContent = e.target.closest('.letter-content');
    if (letterContent) {
        const clickX = e.clientX - letterContent.getBoundingClientRect().left;
        const clickY = e.clientY - letterContent.getBoundingClientRect().top;
        
        // Check if click is on close button area (top-right corner)
        if (clickX > letterContent.offsetWidth - 50 && clickY < 50) {
            const envelope = letterContent.closest('.letter-envelope');
            if (envelope) {
                envelope.classList.remove('opened');
                e.stopPropagation();
            }
        }
    }
});

// Close envelope when pressing Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.letter-envelope.opened').forEach(env => {
            env.classList.remove('opened');
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer cho avatar animation
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const avatarObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe tất cả avatar
    document.querySelectorAll('.couple-avatar').forEach(avatar => {
        avatarObserver.observe(avatar);
    });
});