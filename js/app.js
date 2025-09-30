document.addEventListener('DOMContentLoaded', function() {
    // Debug logging
    console.log('App initialized');
    
    // Function to log which screen is currently active
    function logActiveScreen() {
        const activeScreen = document.querySelector('.app-screen.active');
        console.log('Active screen:', activeScreen ? activeScreen.id : 'none');
    }
    
    // Function to make elements respond to both click and touch
    function enableTouchForElements(selector, callback) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // Add touchstart event for mobile
            element.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Prevent scrolling
                element.classList.add('touch-active');
            }, {passive: false});
            
            // Add touchend event for mobile
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
                element.classList.remove('touch-active');
                callback.call(this, e);
            }, {passive: false});
            
            // Keep regular click for desktop
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                callback.call(this, e);
            });
        });
    }
    
    // Utility function to navigate between screens
    function navigateToScreen(screenId, activeNavIndex) {
        console.log(`Navigating to screen: ${screenId}, nav index: ${activeNavIndex}`);
        
        // Get all screens
        const allScreens = document.querySelectorAll('.app-screen');
        
        // Hide all screens
        allScreens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Update all nav buttons
        document.querySelectorAll('.nav-bar').forEach(navbar => {
            Array.from(navbar.children).forEach((btn, idx) => {
                btn.classList.toggle('active', idx === activeNavIndex);
            });
        });
        
        logActiveScreen();
    }
    
    // Log initial state
    logActiveScreen();
    
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    console.log('Found navigation buttons:', navButtons.length);
    
    // Debug: Log every nav button click to check event handling
    document.body.addEventListener('click', function(event) {
        console.log('Body click detected', event.target);
        
        // Check if the click was on a nav button or its child
        const navButton = event.target.closest('.nav-button');
        if (navButton) {
            console.log('Nav button was clicked:', navButton);
        }
    }, true);
    
    // Get all screens
    const screens = {
        home: document.getElementById('home-screen'),
        map: document.getElementById('map-screen'),
        history: document.getElementById('history-screen'),
        ar: document.getElementById('ar-screen'),
        rewards: document.getElementById('rewards-screen'),
        profile: document.getElementById('profile-screen')
    };
    
    // Make sure to reset all screens first
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
            // Clean up any inline styles that might have been set
            screen.style.display = '';
            screen.style.opacity = '';
        }
    });
    
    // Show home screen as the default
    if (screens.home) {
        screens.home.classList.add('active');
        console.log('Set home screen as active initially');
    }
    
    // Add click event listeners to navigation buttons - improved version
    enableTouchForElements('.nav-button', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('Nav button clicked directly');
        
        // Determine which button was clicked (0-4)
        const buttonIndex = Array.from(this.parentElement.children).indexOf(this);
        
        // Map button indices to screen IDs
        const screenMap = ['home', 'map', 'history', 'rewards', 'profile'];
        const targetScreen = screenMap[buttonIndex];
        
        // Navigate to target screen
        navigateToScreen(targetScreen, buttonIndex);
        
        // For debugging
        console.log('Navigating to: ' + targetScreen);
        logActiveScreen();
    });
    
    // Make sure the first button in each screen is active initially
    const screenContainers = document.querySelectorAll('.app-screen');
    screenContainers.forEach(screen => {
        const firstNavButton = screen.querySelector('.nav-bar .nav-button');
        if (firstNavButton) {
            const index = Array.from(screen.querySelectorAll('.nav-bar .nav-button')).indexOf(firstNavButton);
            const activeButton = screen.querySelectorAll('.nav-bar .nav-button')[index];
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    });
    
    // Add functionality to action buttons
    const beginHikeBtn = document.querySelector('.begin-hike-btn');
    if (beginHikeBtn) {
        enableTouchForElements('.begin-hike-btn', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('Begin hike button clicked');
            
            // Navigate to AR screen
            navigateToScreen('ar', 3);
            
            // For debugging
            console.log('Begin hike clicked, navigating to AR view');
            logActiveScreen();
        });
    }
    
    const findFriendsBtn = document.querySelector('.find-friends-btn');
    if (findFriendsBtn) {
        enableTouchForElements('.find-friends-btn', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Find friends button clicked');
            alert('Find friends feature coming soon!');
        });
    }
    
    const addFamilyBtn = document.querySelector('.add-family-btn');
    if (addFamilyBtn) {
        enableTouchForElements('.add-family-btn', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Add family button clicked');
            alert('Add family members feature coming soon!');
        });
    }
    
    // Add functionality to back buttons
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        enableTouchForElements('.back-button', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Navigate to map screen
            navigateToScreen('map', 1);
            
            // For debugging
            console.log('Back button clicked, returning to map view');
            logActiveScreen();
        });
    });
    
    // Add functionality to map markers
    const mapMarkers = document.querySelectorAll('.map-marker');
    mapMarkers.forEach(marker => {
        enableTouchForElements('.map-marker', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Navigate to history screen
            navigateToScreen('history', 2);
            
            // For debugging
            console.log('Map marker clicked, showing trail details');
            logActiveScreen();
        });
    });
});
console.log('Starting app with all screens visible for display purposes...'); document.addEventListener('DOMContentLoaded', function() { document.querySelectorAll('.app-screen').forEach(screen => screen.classList.add('active')); });
