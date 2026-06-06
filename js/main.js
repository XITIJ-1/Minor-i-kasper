// Main JavaScript for Urban Cafe Website

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Active Link Highlighting
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

setActiveLink();

// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            // Show success message
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ Subscribed!';
            button.style.backgroundColor = '#27AE60';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.reset();
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        }
    });
}

// Load Featured Items on Home Page
function loadFeaturedItems() {
    const featuredContainer = document.getElementById('featuredItems');
    if (!featuredContainer) return;

    fetch('data/menu.json')
        .then(response => response.json())
        .then(data => {
            const featured = data.items.filter(item => item.featured);
            featuredContainer.innerHTML = featured.map(item => `
                <div class="featured-card">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="featured-card-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="featured-price">Rs. ${item.price}</div>
                        <div style="color: #FFD700; margin-top: 8px;">
                            ${'★'.repeat(Math.floor(item.rating))}☆
                            <span style="color: #7A7A7A; font-size: 0.85rem;">(${item.rating})</span>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading featured items:', error));
}

// Load Testimonials on Home Page
function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials');
    if (!testimonialsContainer) return;

    fetch('data/testimonials.json')
        .then(response => response.json())
        .then(data => {
            testimonialsContainer.innerHTML = data.testimonials.map(testimonial => `
                <div class="testimonial-card">
                    <div class="testimonial-header">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                        <div class="testimonial-author">
                            <h4>${testimonial.name}</h4>
                            <p>${new Date(testimonial.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading testimonials:', error));
}

// Load Team Members on About Page
function loadTeamMembers() {
    const teamContainer = document.getElementById('teamMembers');
    if (!teamContainer) return;

    fetch('data/team.json')
        .then(response => response.json())
        .then(data => {
            teamContainer.innerHTML = data.team.map(member => `
                <div class="team-card">
                    <img src="${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p class="team-position">${member.position}</p>
                    <p>${member.bio}</p>
                    <small style="color: #7A7A7A;">${member.experience}</small>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error loading team members:', error));
}

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Page Load Animations
window.addEventListener('load', function() {
    loadFeaturedItems();
    loadTestimonials();
    loadTeamMembers();
});

// Scroll Effect for Navigation Bar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-md)';
        }
        
        lastScroll = currentScroll;
    });
}

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Urban Cafe Website - Main JS Loaded Successfully!');
