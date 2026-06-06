// Form Validation Script

const reservationForm = document.getElementById('reservationForm');
const contactForm = document.getElementById('contactForm');

// Validation rules
const validationRules = {
    name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    phone: {
        validate: (value) => /^[\d+\-\s()]+$/.test(value) && value.trim().length >= 10,
        message: 'Please enter a valid phone number'
    },
    date: {
        validate: (value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        message: 'Please select a future date'
    },
    time: {
        validate: (value) => value.trim() !== '',
        message: 'Please select a time'
    },
    guests: {
        validate: (value) => value !== '',
        message: 'Please select number of guests'
    },
    subject: {
        validate: (value) => value !== '',
        message: 'Please select a subject'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Message must be at least 10 characters long'
    },
    terms: {
        validate: (value) => value === true,
        message: 'You must agree to the terms and conditions'
    }
};

// Show error message
function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#E74C3C';
    }
}

// Clear error message
function clearError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validate single field
function validateField(fieldName, value, isCheckbox = false) {
    const rule = validationRules[fieldName];
    if (!rule) return true;

    if (isCheckbox) {
        value = value.checked;
    }

    if (!rule.validate(value)) {
        showError(fieldName, rule.message);
        return false;
    } else {
        clearError(fieldName);
        return true;
    }
}

// Validate entire form
function validateForm(form) {
    const formData = new FormData(form);
    let isValid = true;

    for (let [fieldName, value] of formData.entries()) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const isCheckbox = field.type === 'checkbox';
        
        if (!validateField(fieldName, value, isCheckbox)) {
            isValid = false;
        }
    }

    // Check terms checkbox separately if it exists
    const termsCheckbox = form.querySelector('[name="terms"]');
    if (termsCheckbox && !validateField('terms', termsCheckbox)) {
        isValid = false;
    }

    return isValid;
}

// Show success message
function showSuccessMessage(form) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = '✓ Form submitted successfully!';
    message.style.cssText = `
        background-color: #27AE60;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        animation: slideDown 0.3s ease;
    `;
    
    form.insertBefore(message, form.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Reservation Form Handler
if (reservationForm) {
    // Real-time validation
    reservationForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.name && this.value) {
                const isCheckbox = this.type === 'checkbox';
                validateField(this.name, this.value, isCheckbox);
            }
        });
    });

    // Form submission
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Store in localStorage (for demonstration)
            localStorage.setItem('lastReservation', JSON.stringify(data));

            // Show success message
            showSuccessMessage(this);

            // Reset form
            setTimeout(() => {
                this.reset();
                this.querySelectorAll('input, select, textarea').forEach(field => {
                    clearError(field.name);
                });
            }, 500);

            console.log('Reservation submitted:', data);
        }
    });
}

// Contact Form Handler
if (contactForm) {
    // Real-time validation
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.name && this.value) {
                const isCheckbox = this.type === 'checkbox';
                validateField(this.name, this.value, isCheckbox);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Store in localStorage (for demonstration)
            localStorage.setItem('lastContact', JSON.stringify(data));

            // Show success message
            showSuccessMessage(this);

            // Reset form
            setTimeout(() => {
                this.reset();
                this.querySelectorAll('input, select, textarea').forEach(field => {
                    clearError(field.name);
                });
            }, 500);

            console.log('Contact form submitted:', data);
        }
    });
}

// Add CSS for validation messages if not present
const style = document.createElement('style');
style.textContent = `
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--color-dark);
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--color-light-gray);
        border-radius: var(--radius-md);
        font-family: var(--font-body);
        font-size: 1rem;
        transition: all var(--transition-fast);
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(212, 117, 46, 0.1);
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #E74C3C;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .error-message {
        display: block;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        color: #E74C3C;
        min-height: 1.2rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
    
    .form-group.checkbox {
        display: flex;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }
    
    .form-group.checkbox input {
        width: auto;
        margin-right: 0.5rem;
        margin-top: 0.25rem;
        cursor: pointer;
    }
    
    .form-group.checkbox label {
        margin-bottom: 0;
        cursor: pointer;
    }
    
    .success-message {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body.dark-mode .form-group input,
    body.dark-mode .form-group select,
    body.dark-mode .form-group textarea {
        background-color: var(--color-light-gray);
        color: var(--color-dark);
        border-color: var(--color-gray);
    }
    
    body.dark-mode .form-group label {
        color: var(--color-dark);
    }
`;
document.head.appendChild(style);

console.log('Form Validation Script Loaded!');
