// Menu Filter and Search Script

const filterButtons = document.querySelectorAll('.filter-btn');
const menuSearch = document.getElementById('menuSearch');
const menuGrid = document.getElementById('menuItems');

let allMenuItems = [];
let currentFilter = 'all';

// Load menu items from JSON
async function loadMenuItems() {
    try {
        const response = await fetch('data/menu.json');
        const data = await response.json();
        allMenuItems = data.items;
        displayMenuItems(allMenuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        menuGrid.innerHTML = '<p>Error loading menu items. Please try again later.</p>';
    }
}

// Display menu items
function displayMenuItems(items) {
    if (!menuGrid) return;
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7A7A7A; font-size: 1.1rem;">No items found</p>';
        return;
    }
    
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-card" data-category="${item.category}">
            <div class="menu-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <span class="menu-badge">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
            </div>
            <div class="menu-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">Rs. ${item.price}</span>
                    <span class="menu-rating">${'★'.repeat(Math.floor(item.rating))}☆ ${item.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter menu items
function filterMenuItems(category) {
    currentFilter = category;
    let filtered = allMenuItems;
    
    if (category !== 'all') {
        filtered = allMenuItems.filter(item => item.category === category);
    }
    
    // Also apply search if there's a search term
    const searchTerm = menuSearch.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayMenuItems(filtered);
}

// Search menu items
function searchMenuItems(searchTerm) {
    let filtered = allMenuItems;
    const term = searchTerm.toLowerCase();
    
    // Apply current filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    // Apply search
    filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
    
    displayMenuItems(filtered);
}

// Event listeners for filter buttons
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter items
            const category = this.getAttribute('data-filter');
            filterMenuItems(category);
        });
    });
}

// Event listener for search input
if (menuSearch) {
    menuSearch.addEventListener('input', function(e) {
        searchMenuItems(e.target.value);
    });
    
    // Clear search on ESC key
    menuSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            searchMenuItems('');
        }
    });
}

// Add CSS for menu cards if not already present
const style = document.createElement('style');
style.textContent = `
    .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .menu-card {
        background: var(--color-white);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all var(--transition-normal);
    }
    
    .menu-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-xl);
    }
    
    .menu-image {
        position: relative;
        overflow: hidden;
        height: 200px;
    }
    
    .menu-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-normal);
    }
    
    .menu-card:hover .menu-image img {
        transform: scale(1.1);
    }
    
    .menu-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--color-primary);
        color: var(--color-white);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .menu-content {
        padding: var(--spacing-lg);
    }
    
    .menu-content h3 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-sm);
    }
    
    .menu-content p {
        color: var(--color-dark-gray);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-md);
    }
    
    .menu-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-light-gray);
    }
    
    .menu-price {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-primary);
    }
    
    .menu-rating {
        color: #FFD700;
        font-size: var(--font-size-sm);
    }
    
    .menu-filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 0.5rem 1.5rem;
        border: 2px solid var(--color-primary);
        background: transparent;
        color: var(--color-primary);
        border-radius: var(--radius-full);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .filter-btn:hover {
        background: var(--color-primary);
        color: var(--color-white);
    }
    
    .filter-btn.active {
        background: var(--color-primary);
        color: var(--color-white);
    }
    
    .menu-search {
        position: relative;
        max-width: 500px;
        margin: 0 auto 2rem;
    }
    
    .menu-search input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 2px solid var(--color-light-gray);
        border-radius: var(--radius-md);
        font-family: var(--font-body);
        transition: all var(--transition-fast);
    }
    
    .menu-search input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(212, 117, 46, 0.1);
    }
    
    .menu-search i {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-dark-gray);
    }
    
    body.dark-mode .menu-card {
        background-color: var(--color-light-gray);
    }
    
    body.dark-mode .menu-search input {
        background-color: var(--color-light-gray);
        color: var(--color-dark);
        border-color: var(--color-gray);
    }
`;
document.head.appendChild(style);

// Load menu on page load
window.addEventListener('DOMContentLoaded', loadMenuItems);

console.log('Menu Script Loaded!');
