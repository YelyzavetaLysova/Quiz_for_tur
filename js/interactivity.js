// Trail Tale App - Enhanced Interactivity Features

class InteractivityManager {
    constructor() {
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isScrolling = false;
        this.rippleElements = [];
        
        this.init();
    }
    
    init() {
        this.setupRippleEffects();
        this.setupTouchInteractions();
        this.setupScrollEnhancements();
        this.setupLoadingStates();
        this.setupHoverEffects();
        console.log('Interactivity Manager initialized');
    }
    
    setupRippleEffects() {
        // Add ripple effect to buttons and clickable elements
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .trail-card, .nav-item, .badge-item');
            if (button && !button.classList.contains('no-ripple')) {
                this.createRipple(e, button);
            }
        });
    }
    
    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s linear;
            z-index: 1000;
        `;
        
        // Ensure element has relative positioning
        const computedStyle = getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        // Add CSS animation if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .ripple-effect {
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupTouchInteractions() {
        // Enhanced touch feedback for mobile devices
        document.addEventListener('touchstart', (e) => {
            const touchable = e.target.closest('button, .trail-card, .nav-item, .badge-item');
            if (touchable) {
                touchable.classList.add('touch-active');
                this.touchStartY = e.touches[0].clientY;
                this.touchStartTime = Date.now();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchable = e.target.closest('button, .trail-card, .nav-item, .badge-item');
            if (touchable) {
                setTimeout(() => {
                    touchable.classList.remove('touch-active');
                }, 150);
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (this.touchStartY) {
                const currentY = e.touches[0].clientY;
                const deltaY = Math.abs(currentY - this.touchStartY);
                
                if (deltaY > 10) {
                    this.isScrolling = true;
                    // Remove touch feedback if scrolling
                    document.querySelectorAll('.touch-active').forEach(el => {
                        el.classList.remove('touch-active');
                    });
                }
            }
        }, { passive: true });
        
        // Add touch feedback styles
        if (!document.querySelector('#touch-styles')) {
            const style = document.createElement('style');
            style.id = 'touch-styles';
            style.textContent = `
                .touch-active {
                    transform: scale(0.98) !important;
                    opacity: 0.8 !important;
                    transition: all 0.1s ease !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupScrollEnhancements() {
        // Smooth scroll behavior for screen content
        document.querySelectorAll('.screen-content').forEach(content => {
            content.style.scrollBehavior = 'smooth';
            
            // Add scroll indicators
            content.addEventListener('scroll', (e) => {
                this.updateScrollIndicators(e.target);
            });
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe animatable elements
        setTimeout(() => {
            document.querySelectorAll('.trail-card, .stat-card, .badge-item, .member-item').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }
    
    updateScrollIndicators(scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        // Update any scroll indicators if they exist
        const indicator = scrollContainer.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.transform = `scaleX(${scrollPercentage / 100})`;
        }
    }
    
    setupLoadingStates() {
        // Add loading states for buttons
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && !button.classList.contains('no-loading')) {
                this.showButtonLoading(button);
            }
        });
    }
    
    showButtonLoading(button) {
        if (button.classList.contains('loading')) return;
        
        const originalText = button.textContent;
        button.classList.add('loading');
        button.disabled = true;
        
        // Create loading animation
        let dots = '';
        const loadingInterval = setInterval(() => {
            dots = dots.length >= 3 ? '' : dots + '.';
            button.textContent = `Loading${dots}`;
        }, 200);
        
        // Reset after 1.5 seconds
        setTimeout(() => {
            clearInterval(loadingInterval);
            button.textContent = originalText;
            button.classList.remove('loading');
            button.disabled = false;
        }, 1500);
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for desktop
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: hover) {
                .trail-card:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(0, 105, 75, 0.15);
                }
                
                .badge-item:hover {
                    transform: translateY(-2px) scale(1.05);
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                }
                
                .nav-item:hover {
                    transform: scale(1.1);
                }
                
                .action-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .member-item:hover {
                    background: #f8f9fa;
                }
                
                .leaderboard-item:hover {
                    background: #f8f9fa;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Utility methods for enhanced interactions
    
    pulseElement(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
        
        // Add pulse animation if not exists
        if (!document.querySelector('#pulse-styles')) {
            const style = document.createElement('style');
            style.id = 'pulse-styles';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    shakeElement(element, duration = 500) {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
        
        // Add shake animation if not exists
        if (!document.querySelector('#shake-styles')) {
            const style = document.createElement('style');
            style.id = 'shake-styles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    bounceElement(element, duration = 600) {
        element.style.animation = `bounce ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
        
        // Add bounce animation if not exists
        if (!document.querySelector('#bounce-styles')) {
            const style = document.createElement('style');
            style.id = 'bounce-styles';
            style.textContent = `
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    25% { transform: translateY(-10px); }
                    50% { transform: translateY(-5px); }
                    75% { transform: translateY(-2px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    highlightElement(element, color = '#00A86B', duration = 2000) {
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = color;
        element.style.transition = 'background-color 0.3s ease';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
        }, duration);
    }
    
    // Haptic feedback simulation for supported devices
    vibrate(pattern = [100]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
    
    // Enhanced notification system
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 500;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            transition: transform 0.3s ease;
            max-width: 300px;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Hide toast
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    getToastColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#00694B'
        };
        return colors[type] || colors.info;
    }
    
    // Progressive loading for images
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.interactivityManager = new InteractivityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractivityManager;
}
