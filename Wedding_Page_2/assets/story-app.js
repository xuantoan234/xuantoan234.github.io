// Wedding Story - JavaScript

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ========== Story Navigation ==========
let currentStoryIndex = 0;
const stories = $$('.story');
const progressBars = $$('.progress-bar');
const storiesContainer = $('#storiesContainer');

// ========== Animated Comments ==========
let commentAnimationRunning = false;
let userHasScrolled = false;

function hideAllComments() {
  stories.forEach((story) => {
    const commentsOverlay = story.querySelector('.comments-overlay');
    if (commentsOverlay) {
      commentsOverlay.style.opacity = '0';
      commentsOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        commentsOverlay.style.display = 'none';
      }, 300);
    }
  });
}

function animateComments(storyIndex) {
  // If user has scrolled away from first page, hide all comments
  if (userHasScrolled && storyIndex !== 0) {
    hideAllComments();
    return;
  }
  
  // Only show and animate comments on first story
  if (storyIndex === 0) {
    const story = stories[0];
    const commentsOverlay = story.querySelector('.comments-overlay');
    if (!commentsOverlay) return;
    
    // Show overlay
    commentsOverlay.style.display = 'flex';
    commentsOverlay.style.opacity = '1';
    commentsOverlay.style.pointerEvents = 'none';
    
    const comments = Array.from(commentsOverlay.querySelectorAll('.comment'));
    
    // Hide all comments first
    comments.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
    });
    
    // Animate only once
    if (!commentAnimationRunning) {
      commentAnimationRunning = true;
      
      console.log('🎬 Starting comment animation on first story...');
      
      // Show comments one by one with 800ms delay between each
      comments.forEach((comment, index) => {
        setTimeout(() => {
          comment.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          comment.style.opacity = '1';
          comment.style.transform = 'translateY(0)';
          console.log(`✨ Comment ${index + 1}/${comments.length} shown`);
        }, index * 800);
      });
    }
  } else {
    // Hide comments on other stories
    hideAllComments();
  }
}

// Update progress bars
function updateProgress(index) {
  progressBars.forEach((bar, i) => {
    if (i < index) {
      bar.classList.add('active');
      bar.querySelector('.progress-bar__fill').style.width = '100%';
    } else if (i === index) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
      bar.querySelector('.progress-bar__fill').style.width = '0';
    }
  });
}

// Scroll to story
function goToStory(index) {
  if (index < 0 || index >= stories.length) return;
  
  currentStoryIndex = index;
  stories[index].scrollIntoView({ behavior: 'smooth' });
  updateProgress(index);
  
  // Update active class
  stories.forEach((story, i) => {
    if (i === index) {
      story.classList.add('active');
    } else {
      story.classList.remove('active');
    }
  });
  
  // Animate comments for current story
  animateComments(index);
}

// Handle scroll
let scrollTimeout;
storiesContainer.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollTop = storiesContainer.scrollTop;
    const viewportHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);
    
    // Mark that user has started scrolling
    if (newIndex !== 0) {
      userHasScrolled = true;
    }
    
    if (newIndex !== currentStoryIndex) {
      currentStoryIndex = newIndex;
      updateProgress(newIndex);
      
      stories.forEach((story, i) => {
        if (i === newIndex) {
          story.classList.add('active');
        } else {
          story.classList.remove('active');
        }
      });
      
      // Animate comments when scrolling to new story
      animateComments(newIndex);
    }
  }, 100);
});

// Touch gestures for navigation
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let isScrolling = false;

storiesContainer.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
  isScrolling = false;
});

storiesContainer.addEventListener('touchmove', (e) => {
  isScrolling = true;
});

storiesContainer.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].clientY;
  
  // Only handle swipe if it was a deliberate quick swipe, not a scroll
  if (!isScrolling) {
    handleSwipe();
  }
});

function handleSwipe() {
  const swipeDistance = touchStartY - touchEndY;
  const swipeTime = Date.now() - touchStartTime;
  const minSwipeDistance = 80; // Increased threshold
  const maxSwipeTime = 300; // Must be quick
  
  // Only navigate if it's a quick, deliberate swipe
  if (Math.abs(swipeDistance) > minSwipeDistance && swipeTime < maxSwipeTime) {
    if (swipeDistance > 0) {
      // Swipe up - next story
      if (currentStoryIndex < stories.length - 1) {
        goToStory(currentStoryIndex + 1);
      }
    } else {
      // Swipe down - previous story
      if (currentStoryIndex > 0) {
        goToStory(currentStoryIndex - 1);
      }
    }
  }
}

// Click left/right areas for navigation
stories.forEach((story, index) => {
  story.addEventListener('click', (e) => {
    const rect = story.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // Ignore clicks on interactive elements
    if (e.target.closest('button, input, form, .comments-overlay')) {
      return;
    }
    
    if (clickX < width * 0.3) {
      // Left third - previous story
      if (currentStoryIndex > 0) {
        goToStory(currentStoryIndex - 1);
      }
    } else if (clickX > width * 0.7) {
      // Right third - next story
      if (currentStoryIndex < stories.length - 1) {
        goToStory(currentStoryIndex + 1);
      }
    }
  });
});

// Initialize first story
goToStory(0);

// ========== Countdown Timer ==========
const WEDDING_DATE = new Date('2026-02-22T14:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;
  
  if (distance < 0) {
    $('#cdDays').textContent = '0';
    $('#cdHours').textContent = '0';
    $('#cdMins').textContent = '0';
    $('#cdSecs').textContent = '0';
    return;
  }
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  $('#cdDays').textContent = days;
  $('#cdHours').textContent = hours;
  $('#cdMins').textContent = minutes;
  $('#cdSecs').textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ========== Music Control ==========
const musicBtn = $('#musicBtn');
const bgm = $('#bgm');
let isPlaying = false;

musicBtn.addEventListener('click', async () => {
  try {
    if (isPlaying) {
      bgm.pause();
      musicBtn.classList.remove('is-playing');
      isPlaying = false;
    } else {
      await bgm.play();
      musicBtn.classList.add('is-playing');
      isPlaying = true;
    }
  } catch (error) {
    console.log('Audio playback failed:', error);
    showToast('Vui lòng bấm để phát nhạc');
  }
});

// Auto play attempt (will only work after user interaction)
document.addEventListener('click', () => {
  if (!isPlaying) {
    bgm.play().then(() => {
      musicBtn.classList.add('is-playing');
      isPlaying = true;
    }).catch(() => {
      // Silent fail - user needs to click music button
    });
  }
}, { once: true });

// ========== RSVP Form ==========
const rsvpForm = $('#rsvpForm');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(rsvpForm);
  const name = formData.get('name');
  const attendance = formData.get('attendance');
  
  // Log to console (replace with your API call)
  console.log('RSVP Submitted:', { name, attendance });
  
  // Show thank you message
  showToast(attendance === 'yes' 
    ? `Cảm ơn ${name}! Hẹn gặp bạn tại đám cưới! 💕` 
    : `Cảm ơn ${name}! Hy vọng có dịp gặp bạn sau! 🙏`
  );
  
  // Reset form
  rsvpForm.reset();
  
  // Optional: Send to Google Sheets, database, etc.
  // sendToGoogleSheets({ name, attendance });
});

// ========== Toast Notification ==========
function showToast(message) {
  // Remove existing toast if any
  const existingToast = $('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    z-index: 9999;
    animation: toastIn 0.3s ease-out;
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  @keyframes toastOut {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
  }
`;
document.head.appendChild(style);

// ========== Action Buttons ==========
$$('.action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (btn.classList.contains('like-btn')) {
      animateHeart(e);
    } else if (btn.classList.contains('gift-btn')) {
      showToast('💝 Cảm ơn món quà của bạn!');
    } else if (btn.querySelector('.action-emoji')) {
      showToast('🎊 Chúc mừng!');
    }
  });
});

// ========== Like Animation ==========
function animateHeart(e) {
  const heart = document.createElement('div');
  heart.textContent = '❤️';
  heart.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    font-size: 24px;
    pointer-events: none;
    z-index: 9999;
    animation: heartFloat 1s ease-out forwards;
  `;
  
  document.body.appendChild(heart);
  
  setTimeout(() => heart.remove(), 1000);
}

// Add heart animation
const heartStyle = document.createElement('style');
heartStyle.textContent = `
  @keyframes heartFloat {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(1.5);
    }
  }
`;
document.head.appendChild(heartStyle);

// ========== Close Button ==========
const closeBtn = $('#closeBtn');
closeBtn.addEventListener('click', () => {
  if (confirm('Bạn có muốn đóng thiệp cưới?')) {
    window.close();
    // If can't close, redirect
    setTimeout(() => {
      showToast('Cảm ơn bạn đã xem! 💕');
    }, 100);
  }
});

// ========== Keyboard Navigation ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && currentStoryIndex > 0) {
    e.preventDefault();
    goToStory(currentStoryIndex - 1);
  } else if (e.key === 'ArrowDown' && currentStoryIndex < stories.length - 1) {
    e.preventDefault();
    goToStory(currentStoryIndex + 1);
  } else if (e.key === 'Escape') {
    closeBtn.click();
  }
});

// ========== Progress Bar Click Navigation ==========
progressBars.forEach((bar, index) => {
  bar.addEventListener('click', () => {
    goToStory(index);
  });
});

// ========== Prevent context menu on long press (mobile) ==========
document.addEventListener('contextmenu', (e) => {
  if (window.innerWidth <= 768) {
    e.preventDefault();
  }
});

// ========== Auto-advance stories (optional) ==========
let autoAdvanceTimer = null;
const AUTO_ADVANCE_DURATION = 15000; // 15 seconds per story

function startAutoAdvance() {
  stopAutoAdvance();
  autoAdvanceTimer = setTimeout(() => {
    if (currentStoryIndex < stories.length - 1) {
      goToStory(currentStoryIndex + 1);
      startAutoAdvance();
    }
  }, AUTO_ADVANCE_DURATION);
}

function stopAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

// Uncomment to enable auto-advance
// startAutoAdvance();

// Stop auto-advance on user interaction
storiesContainer.addEventListener('touchstart', stopAutoAdvance);
storiesContainer.addEventListener('click', stopAutoAdvance);

// ========== Initialize ==========
// Start with first story and animate comments
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    animateComments(0);
  }, 500);
});

console.log('Wedding Story initialized! 💕');
