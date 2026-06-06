// Gallery Lightbox Script

const galleryGrid = document.getElementById('galleryGrid');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

let currentImageIndex = 0;
let galleryImages = [];

// Load gallery images
async function loadGallery() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();
        galleryImages = data.images;
        displayGallery(galleryImages);
    } catch (error) {
        console.error('Error loading gallery:', error);
        if (galleryGrid) {
            galleryGrid.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
        }
    }
}

// Display gallery
function displayGallery(images) {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = images.map((img, index) => `
        <div class="gallery-item" onclick="openLightbox(${index})">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <div class="gallery-overlay">
                <span class="gallery-icon"><i class="fas fa-expand"></i></span>
            </div>
            <p class="gallery-title">${img.title}</p>
        </div>
    `).join('');
}

// Open lightbox
window.openLightbox = function(index) {
    currentImageIndex = index;
    const image = galleryImages[index];
    
    if (lightboxModal && lightboxImage && lightboxCaption) {
        lightboxImage.src = image.src;
        lightboxCaption.textContent = image.title + ' - ' + image.description;
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

// Change lightbox image
window.changeLightboxImage = function(direction) {
    currentImageIndex += direction;
    
    // Wrap around
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxCaption.textContent = image.title + ' - ' + image.description;
};

// Close lightbox
function closeLightbox() {
    if (lightboxModal) {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close button
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

// Close on background click
if (lightboxModal) {
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (lightboxModal && lightboxModal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Add CSS for gallery if not present
const style = document.createElement('style');
style.textContent = `
    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        cursor: pointer;
        transition: all var(--transition-normal);
    }
    
    .gallery-item:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-xl);
    }
    
    .gallery-item img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        transition: transform var(--transition-normal);
    }
    
    .gallery-item:hover img {
        transform: scale(1.1);
    }
    
    .gallery-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(212, 117, 46, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--transition-normal);
    }
    
    .gallery-item:hover .gallery-overlay {
        opacity: 1;
    }
    
    .gallery-icon {
        color: white;
        font-size: 2rem;
    }
    
    .gallery-title {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: white;
        padding: 1.5rem 1rem 1rem;
        margin: 0;
        font-weight: 600;
    }
    
    .lightbox-modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 40px;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 10000;
        transition: color var(--transition-fast);
    }
    
    .lightbox-close:hover {
        color: var(--color-primary);
    }
    
    .lightbox-image {
        margin: auto;
        display: block;
        max-width: 90%;
        max-height: 75vh;
        object-fit: contain;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    .lightbox-caption {
        text-align: center;
        color: white;
        padding: 20px;
        font-size: 1.1rem;
    }
    
    .lightbox-prev,
    .lightbox-next {
        cursor: pointer;
        position: absolute;
        top: 50%;
        width: auto;
        padding: 16px;
        margin-top: -22px;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        font-weight: bold;
        font-size: 18px;
        transition: 0.3s ease;
        border-radius: 3px;
        user-select: none;
    }
    
    .lightbox-next {
        right: 0;
    }
    
    .lightbox-prev {
        left: 0;
    }
    
    .lightbox-prev:hover,
    .lightbox-next:hover {
        background-color: var(--color-primary);
    }
    
    @media (max-width: 768px) {
        .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .lightbox-image {
            max-width: 95%;
            max-height: 70vh;
        }
    }
`;
document.head.appendChild(style);

// Load gallery on page load
window.addEventListener('DOMContentLoaded', loadGallery);

console.log('Gallery Script Loaded!');
