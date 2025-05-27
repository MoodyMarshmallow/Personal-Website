// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const artEasterEgg = document.getElementById('artEasterEgg');
const artModal = document.getElementById('artModal');
const closeModal = document.querySelector('.close');
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = `${savedTheme}-theme`;
    updateThemeToggleIcon(savedTheme);
}

function updateThemeToggleIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
}

// Timeline Filtering
function filterTimeline(category) {
    timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function updateActiveFilter(activeButton) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// Easter Egg Art Portfolio Modal
function openArtModal() {
    artModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeArtModal() {
    artModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterTimeline(filter);
            updateActiveFilter(button);
        });
    });
    
    // Easter egg modal
    artEasterEgg.addEventListener('click', openArtModal);
    closeModal.addEventListener('click', closeArtModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === artModal) {
            closeArtModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && artModal.style.display === 'block') {
            closeArtModal();
        }
    });
    
    // Add ARIA labels for accessibility
    artEasterEgg.setAttribute('aria-label', 'Discover hidden art portfolio');
    artEasterEgg.setAttribute('role', 'button');
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    // Add keyboard navigation for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Add keyboard navigation for easter egg
    artEasterEgg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openArtModal();
        }
    });
});

// Smooth scrolling for timeline section
function smoothScrollToTop() {
    const timelineSection = document.querySelector('.timeline-section');
    timelineSection.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top functionality when filter changes
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(smoothScrollToTop, 100);
    });
});

// Timeline item animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline items for animation
document.addEventListener('DOMContentLoaded', () => {
    timelineItems.forEach(item => {
        // Set initial state for animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        timelineObserver.observe(item);
    });
});

// Easter egg hint - subtle pulsing animation
let pulseInterval;

function startEasterEggHint() {
    pulseInterval = setInterval(() => {
        if (artModal.style.display !== 'block') {
            artEasterEgg.style.transform = 'scale(1.05)';
            setTimeout(() => {
                artEasterEgg.style.transform = 'scale(1)';
            }, 300);
        }
    }, 4000);
}

function stopEasterEggHint() {
    clearInterval(pulseInterval);
}

// Start the hint after 15 seconds, stop after user interaction
setTimeout(() => {
    startEasterEggHint();
}, 15000);

artEasterEgg.addEventListener('mouseenter', stopEasterEggHint);
artEasterEgg.addEventListener('click', stopEasterEggHint);

// Performance optimization: Debounce filter function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced filter function for better performance
const debouncedFilter = debounce(filterTimeline, 100);

// Update filter buttons to use debounced function
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        debouncedFilter(filter);
        updateActiveFilter(button);
    });
});

// Handle external link clicks with loading feedback
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Add subtle loading feedback
        this.style.opacity = '0.7';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 300);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + 1, 2, 3 for filter shortcuts
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[data-filter="all"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[data-filter="achievements"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[data-filter="experience"]').click();
                break;
            case 't':
                e.preventDefault();
                toggleTheme();
                break;
        }
    }
});

// Add focus management for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Apply focus trapping to modal when opened
artEasterEgg.addEventListener('click', () => {
    openArtModal();
    setTimeout(() => {
        trapFocus(document.querySelector('.modal-content'));
        closeModal.focus();
    }, 100);
});

// Timeline item count display
function updateTimelineCount() {
    const visibleItems = document.querySelectorAll('.timeline-item:not(.hidden)').length;
    const totalItems = timelineItems.length;
    
    // Create or update count display
    let countDisplay = document.querySelector('.timeline-count');
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.className = 'timeline-count';
        countDisplay.style.cssText = `
            text-align: center;
            color: var(--text-muted);
            font-size: 0.8rem;
            margin-bottom: 1rem;
            font-weight: 500;
        `;
        document.querySelector('.filter-controls').after(countDisplay);
    }
    
    const activeFilter = document.querySelector('.filter-btn.active').textContent;
    countDisplay.textContent = `Showing ${visibleItems} of ${totalItems} items`;
}

// Update count when filters change
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(updateTimelineCount, 150);
    });
});

// Initialize count on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateTimelineCount, 100);
});

// Console message for developers
console.log(`
🎨 Milo Shan's Portfolio - Redesigned
Split-screen layout with filterable timeline
Dark theme by default with light theme toggle

Keyboard shortcuts:
- Alt + 1: Show all items
- Alt + 2: Show achievements only  
- Alt + 3: Show experience only
- Alt + T: Toggle theme
- Escape: Close modal

Easter egg hint: Look for something creative... 🎭
`);

// Analytics helper (for future use)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Track filter usage
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        trackEvent('Timeline', 'Filter', filter);
    });
});

// Track theme toggle
themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    trackEvent('UI', 'Theme Toggle', newTheme);
});

// Track easter egg discovery
artEasterEgg.addEventListener('click', () => {
    trackEvent('Easter Egg', 'Art Portfolio', 'Discovered');
});
