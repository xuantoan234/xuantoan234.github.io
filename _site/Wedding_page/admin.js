// Admin page functionality
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
    setupUploadArea();
    loadAdminGallery();
    optimizeForMobile();
});

// Setup upload area
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        handleFiles(files);
    });

    // Touch support for mobile
    uploadArea.addEventListener('touchend', (e) => {
        if (e.target === uploadArea || uploadArea.contains(e.target)) {
            e.preventDefault();
            fileInput.click();
        }
    }, { passive: false });

    uploadBtn.addEventListener('click', uploadPhotos);
}

// Handle selected files
function handleFiles(files) {
    if (files.length === 0) return;

    selectedFiles = files;
    showPreview();
    
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.style.display = 'block';
}

// Show preview of selected files
async function showPreview() {
    const previewSection = document.getElementById('previewSection');
    const previewGrid = document.getElementById('previewGrid');
    
    previewSection.style.display = 'block';
    previewGrid.innerHTML = '';

    for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const img = document.createElement('img');
        
        // Check if file is HEIC
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (fileExt === 'heic' || fileExt === 'heif') {
            try {
                // Convert HEIC to JPEG for preview
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.9
                });
                img.src = URL.createObjectURL(convertedBlob);
            } catch (error) {
                console.error('Error converting HEIC:', error);
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%23999">HEIC</text></svg>';
            }
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'preview-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', () => removePreview(index));
        
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        previewGrid.appendChild(previewItem);
    }
}

// Remove file from preview
function removePreview(index) {
    selectedFiles.splice(index, 1);
    
    if (selectedFiles.length === 0) {
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('uploadBtn').style.display = 'none';
        document.getElementById('fileInput').value = '';
    } else {
        showPreview();
    }
}

// Upload photos to localStorage
async function uploadPhotos() {
    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;

    const photos = getPhotosFromStorage();

    for (const file of selectedFiles) {
        try {
            let fileToUpload = file;
            
            // Convert HEIC to JPEG before uploading
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (fileExt === 'heic' || fileExt === 'heif') {
                try {
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.9
                    });
                    fileToUpload = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
                        type: 'image/jpeg'
                    });
                } catch (error) {
                    console.error('Error converting HEIC:', error);
                    continue; // Skip this file
                }
            }
            
            const dataUrl = await readFileAsDataURL(fileToUpload);
            
            // Compress image if needed
            const compressedDataUrl = await compressImage(dataUrl, 1920, 0.85);
            
            photos.push({
                id: Date.now() + Math.random(),
                data: compressedDataUrl,
                caption: '',
                uploadDate: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    savePhotosToStorage(photos);
    
    // Reset
    selectedFiles = [];
    document.getElementById('fileInput').value = '';
    document.getElementById('previewSection').style.display = 'none';
    uploadBtn.style.display = 'none';
    uploadBtn.textContent = 'Upload Selected Photos';
    uploadBtn.disabled = false;
    
    // Reload gallery
    loadAdminGallery();
    
    alert('Photos uploaded successfully!');
}

// Read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Basic image compression
function compressImage(dataUrl, maxWidth, quality) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}

// Load admin gallery
function loadAdminGallery() {
    const gallery = document.getElementById('adminGallery');
    const emptyState = document.getElementById('adminEmptyState');
    const photos = getPhotosFromStorage();

    if (photos.length === 0) {
        emptyState.style.display = 'block';
        gallery.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    gallery.style.display = 'grid';
    gallery.innerHTML = '';

    photos.forEach((photo, index) => {
        const item = createAdminGalleryItem(photo, index);
        gallery.appendChild(item);
    });
}

// Create admin gallery item with delete button
function createAdminGalleryItem(photo, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = photo.data;
    img.alt = 'Wedding photo';
    img.loading = 'lazy';
    
    // Detect image orientation
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
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.setAttribute('title', 'Delete photo');
    deleteBtn.setAttribute('aria-label', 'Delete photo');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deletePhoto(index);
    });
    
    // Better touch support
    deleteBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        deletePhoto(index);
    }, { passive: false });
    
    div.appendChild(img);
    div.appendChild(deleteBtn);
    
    return div;
}

// Delete photo
function deletePhoto(index) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }

    const photos = getPhotosFromStorage();
    photos.splice(index, 1);
    savePhotosToStorage(photos);
    loadAdminGallery();
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

// Mobile optimizations
function optimizeForMobile() {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Adjust image compression for mobile
        window.mobileOptimization = true;
        
        // Add viewport meta if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            document.head.appendChild(meta);
        }
    }
}
