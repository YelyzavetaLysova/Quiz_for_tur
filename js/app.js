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

    // --- Demo data population (lightweight, for demo only) ---
    const demoData = {
        family: {
            name: 'Thompson Family',
            description: '4 adventurous explorers',
            level: 8,
            members: [
                { emoji: '👩', name: 'Mom', level: 4, points: '4050p' },
                { emoji: '👨', name: 'Dad', level: 3, points: '3270p' },
                { emoji: '👧', name: 'Emma', level: 2, points: '2400p' },
                { emoji: '👦', name: 'Sam', level: 2, points: '2135p' }
            ]
        },
        trails: [
            { title: 'Enchanted Forest Loop', rating: '4.8', difficulty: 'Medium', duration: '45-50 min', description: 'A magical journey through ancient trees with AR creatures and hidden treasures.' },
            { title: 'Riverside Discovery', rating: '4.6', difficulty: 'Easy', duration: '30-40 min', description: 'Learn about water life and ecosystems along the peaceful river trail.' },
            { title: 'Mountain View Challenge', rating: '4.7', difficulty: 'Hard', duration: '60-90 min', description: 'A challenging hike with amazing views and exploration activities.' }
        ],
        badges: [
            { icon: 'fas fa-leaf', title: 'First Adventure', text: 'First family adventure completed!' },
            { icon: 'fas fa-paw', title: 'Discoverer', text: 'Discovered 5 different animal species!' },
            { icon: 'fas fa-hiking', title: 'Trail Master', text: 'Completed 5 challenging trails' }
        ],
        leaderboard: [
            { place: 1, name: 'Adventure Family', points: '4250p', icon: 'fas fa-mountain' },
            { place: 2, name: 'Nature Lovers', points: '3850p', icon: 'fas fa-tree' },
            { place: 3, name: 'The Explorers', points: '3465p', icon: 'fas fa-book' }
        ]
    };

    function populateDemoData() {
        // Family header
        const familyNameEl = document.querySelector('.family-name');
        const familyDescEl = document.querySelector('.family-description');
        const levelNumberEl = document.querySelector('.level-number');

        if (familyNameEl) familyNameEl.textContent = demoData.family.name;
        if (familyDescEl) familyDescEl.textContent = demoData.family.description;
        if (levelNumberEl) levelNumberEl.textContent = demoData.family.level;

        // Family members
        const memberEls = document.querySelectorAll('.family-members .member');
        memberEls.forEach((el, idx) => {
            const member = demoData.family.members[idx];
            if (!member) return;
            const emoji = el.querySelector('.member-emoji');
            const name = el.querySelector('.member-name');
            const lvl = el.querySelector('.member-level');
            const pts = el.querySelector('.member-points');
            if (emoji) emoji.textContent = member.emoji;
            if (name) name.textContent = member.name;
            if (lvl) lvl.textContent = `Lvl ${member.level}`;
            if (pts) pts.textContent = member.points;
        });

        // Trails list (replace existing .trail-list contents)
        const trailList = document.querySelector('.trail-list');
        if (trailList) {
            trailList.innerHTML = '';
            demoData.trails.forEach(trail => {
                const div = document.createElement('div');
                div.className = 'trail-item';
                div.innerHTML = `
                    <div class="trail-rating">${trail.rating}</div>
                    <div class="trail-details">
                        <h4>${trail.title}</h4>
                        <p>${trail.description}</p>
                        <div class="trail-meta">
                            <span class="difficulty">${trail.difficulty}</span>
                            <span class="duration">${trail.duration}</span>
                        </div>
                    </div>
                    <button class="select-trail-btn">Select</button>
                `.trim();
                trailList.appendChild(div);
            });
        }

        // Badges
        const badgesContainer = document.querySelector('.badges-container');
        if (badgesContainer) {
            badgesContainer.innerHTML = '';
            demoData.badges.forEach(b => {
                const card = document.createElement('div');
                card.className = 'badge-card';
                card.innerHTML = `
                    <div class="badge-icon"><i class="${b.icon}"></i></div>
                    <div class="badge-info">
                        <h4>${b.title}</h4>
                        <p>${b.text}</p>
                    </div>
                    <div class="badge-check"><i class="fas fa-check-circle"></i></div>
                `.trim();
                badgesContainer.appendChild(card);
            });
        }

        // Leaderboard
        const leaderboardEl = document.querySelector('.leaderboard');
        if (leaderboardEl) {
            leaderboardEl.innerHTML = '';
            demoData.leaderboard.forEach(row => {
                const r = document.createElement('div');
                r.className = 'leader-row';
                r.innerHTML = `
                    <div class="leader-place">${row.place}</div>
                    <div class="leader-icon"><i class="${row.icon}"></i></div>
                    <div class="leader-info"><h4>${row.name}</h4><p>${row.points}</p></div>
                `.trim();
                leaderboardEl.appendChild(r);
            });
        }
    }

    // Populate demo data once DOM is ready
    populateDemoData();
});
console.log('Starting app with all screens visible for display purposes...'); document.addEventListener('DOMContentLoaded', function() { document.querySelectorAll('.app-screen').forEach(screen => screen.classList.add('active')); });
