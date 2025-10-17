// Trail Tale Mobile App - Main Application Logic

class TrailTaleApp {
    constructor() {
        this.currentScreen = 'home';
        this.trails = [
            {
                id: 1,
                title: 'Forest Discovery',
                description: 'Explore the ancient woodland paths',
                difficulty: 'easy',
                distance: '2.5 km',
                emoji: '🌲',
                completed: true
            },
            {
                id: 2,
                title: 'Mountain Challenge',
                description: 'Conquer the summit trail',
                difficulty: 'hard',
                distance: '5.2 km',
                emoji: '🏔️',
                completed: false
            },
            {
                id: 3,
                title: 'Riverside Walk',
                description: 'Follow the meandering stream',
                difficulty: 'medium',
                distance: '3.8 km',
                emoji: '🏞️',
                completed: false
            }
        ];
        
        this.familyData = {
            name: 'The Adventure Family',
            members: [
                { name: 'Sarah', role: 'Trail Leader', badges: 12, avatar: '👩' },
                { name: 'Mike', role: 'Navigator', badges: 8, avatar: '👨' },
                { name: 'Emma', role: 'Explorer', badges: 6, avatar: '👧' },
                { name: 'Jake', role: 'Scout', badges: 4, avatar: '👦' }
            ],
            stats: {
                trailsCompleted: 15,
                totalDistance: 42.3,
                badgesEarned: 30,
                daysActive: 120
            }
        };
        
        this.badges = [
            { name: 'First Steps', description: 'Complete your first trail', icon: '👣', earned: true },
            { name: 'Forest Friend', description: 'Explore 5 forest trails', icon: '🌳', earned: true },
            { name: 'Mountain Master', description: 'Conquer a difficult peak', icon: '⛰️', earned: false },
            { name: 'River Runner', description: 'Follow water trails', icon: '💧', earned: true },
            { name: 'Family Explorer', description: 'Complete trails with family', icon: '👨‍👩‍👧‍👦', earned: true },
            { name: 'Distance Walker', description: 'Walk 50km total', icon: '🚶', earned: false }
        ];
        
        this.leaderboard = [
            { rank: 1, name: 'Adventure Squad', badges: 45, score: 2850 },
            { rank: 2, name: 'Mountain Hikers', badges: 38, score: 2340 },
            { rank: 3, name: 'The Explorers', badges: 30, score: 1920 },
            { rank: 4, name: 'Trail Blazers', badges: 28, score: 1750 },
            { rank: 5, name: 'Nature Walkers', badges: 25, score: 1580 }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderAllScreens();
        console.log('Trail Tale App initialized');
    }
    
    setupEventListeners() {
        // Navigation handlers
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                const screen = navItem.dataset.screen;
                if (screen) {
                    this.navigateToScreen(screen);
                }
            }
            
            // Trail action buttons
            if (e.target.classList.contains('story-btn')) {
                const trailId = e.target.dataset.trailId;
                this.startStoryMode(trailId);
            }
            
            if (e.target.classList.contains('ar-btn')) {
                const trailId = e.target.dataset.trailId;
                this.startARMode(trailId);
            }
            
            if (e.target.classList.contains('primary-btn')) {
                const trailId = e.target.dataset.trailId;
                this.startTrail(trailId);
            }
        });
    }
    
    navigateToScreen(screenName) {
        // Prevent multiple rapid clicks
        if (this.isNavigating) return;
        this.isNavigating = true;
        
        // Add navigation feedback
        const targetNavItem = document.querySelector(`[data-screen="${screenName}"]`);
        if (targetNavItem) {
            // Add ripple effect to the clicked nav item
            this.addNavRipple(targetNavItem);
            
            // Update navigation state with animation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                item.style.transform = '';
            });
            
            // Animate the new active item
            targetNavItem.classList.add('active');
            targetNavItem.style.transform = 'translateY(-3px) scale(1.05)';
            
            // Reset animation after delay
            setTimeout(() => {
                targetNavItem.style.transform = '';
            }, 200);
        }
        
        // Update current screen
        this.currentScreen = screenName;
        
        // Show enhanced notification with screen-specific messages
        const screenMessages = {
            home: '🏠 Welcome home! Ready for your next adventure?',
            map: '🗺️ Exploring trail locations and routes',
            history: '📊 Reviewing your hiking achievements',
            ar: '📱 Activating augmented reality mode',
            rewards: '🏆 Checking your badges and progress',
            profile: '👤 Managing your family adventure profile'
        };
        
        this.showNotification(screenMessages[screenName] || `Navigated to ${screenName}`, 'success');
        
        // Haptic feedback if available
        if (window.interactivityManager) {
            window.interactivityManager.vibrate([50]);
        }
        
        // Re-enable navigation after animation
        setTimeout(() => {
            this.isNavigating = false;
        }, 300);
    }
    
    addNavRipple(navItem) {
        const ripple = document.createElement('div');
        ripple.className = 'nav-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: navRipple 0.6s ease-out;
            pointer-events: none;
            opacity: 0.3;
        `;
        
        navItem.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        // Add CSS animation if not already added
        if (!document.querySelector('#nav-ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'nav-ripple-styles';
            style.textContent = `
                @keyframes navRipple {
                    to {
                        transform: translate(-50%, -50%) scale(6);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    renderAllScreens() {
        this.renderHomeScreen();
        this.renderMapScreen();
        this.renderHistoryScreen();
        this.renderARScreen();
        this.renderRewardsScreen();
        this.renderProfileScreen();
    }
    
    renderHomeScreen() {
        const homeContent = document.querySelector('#home .screen-content');
        if (!homeContent) return;
        
        homeContent.innerHTML = `
            <div class="family-header">
                <h2 class="family-name">${this.familyData.name}</h2>
                <p class="family-subtitle">Ready for your next adventure?</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.trailsCompleted}</span>
                    <span class="stat-label">Trails Completed</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.totalDistance}</span>
                    <span class="stat-label">KM Walked</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.badgesEarned}</span>
                    <span class="stat-label">Badges Earned</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.daysActive}</span>
                    <span class="stat-label">Days Active</span>
                </div>
            </div>
            
            <div class="trails-section">
                <h3 class="section-title">Available Trails</h3>
                ${this.trails.map(trail => this.renderTrailCard(trail)).join('')}
            </div>
        `;
    }
    
    renderTrailCard(trail) {
        return `
            <div class="trail-card">
                <div class="trail-image">
                    <span>${trail.emoji}</span>
                </div>
                <div class="trail-content">
                    <h4 class="trail-title">${trail.title}</h4>
                    <p class="trail-description">${trail.description}</p>
                    <div class="trail-meta">
                        <span class="difficulty-badge difficulty-${trail.difficulty}">
                            ${trail.difficulty.toUpperCase()}
                        </span>
                        <span class="trail-distance">${trail.distance}</span>
                    </div>
                    <div class="trail-actions">
                        <button class="action-btn secondary-btn story-btn" data-trail-id="${trail.id}">
                            📖 Story
                        </button>
                        <button class="action-btn secondary-btn ar-btn" data-trail-id="${trail.id}">
                            📱 AR Mode
                        </button>
                        <button class="action-btn primary-btn" data-trail-id="${trail.id}">
                            🚀 Start
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderMapScreen() {
        const mapContent = document.querySelector('#map .screen-content');
        if (!mapContent) return;
        
        mapContent.innerHTML = `
            <div class="map-container">
                <div class="map-placeholder">
                    🗺️ Interactive Trail Map
                    <br><small>Tap trails to explore</small>
                </div>
            </div>
            
            <div class="map-trails">
                ${this.trails.map(trail => `
                    <div class="map-trail-item">
                        <div class="trail-info">
                            <h4>${trail.emoji} ${trail.title}</h4>
                            <p>${trail.distance} • ${trail.difficulty}</p>
                        </div>
                        <span class="trail-status ${trail.completed ? 'status-completed' : 'status-active'}">
                            ${trail.completed ? 'Completed' : 'Available'}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderHistoryScreen() {
        const historyContent = document.querySelector('#history .screen-content');
        if (!historyContent) return;
        
        const completedTrails = this.trails.filter(trail => trail.completed);
        
        historyContent.innerHTML = `
            <div class="section-title">Trail History</div>
            
            ${completedTrails.length > 0 ? 
                completedTrails.map(trail => `
                    <div class="trail-card">
                        <div class="trail-image">
                            <span>${trail.emoji}</span>
                        </div>
                        <div class="trail-content">
                            <h4 class="trail-title">${trail.title} ✅</h4>
                            <p class="trail-description">${trail.description}</p>
                            <div class="trail-meta">
                                <span class="difficulty-badge difficulty-${trail.difficulty}">
                                    COMPLETED
                                </span>
                                <span class="trail-distance">${trail.distance}</span>
                            </div>
                            <div class="trail-actions">
                                <button class="action-btn primary-btn">
                                    📊 View Details
                                </button>
                                <button class="action-btn secondary-btn">
                                    🔄 Repeat Trail
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('') 
                : 
                '<div class="empty-state">No completed trails yet. Start your first adventure!</div>'
            }
        `;
    }
    
    renderARScreen() {
        const arContent = document.querySelector('#ar .screen-content');
        if (!arContent) return;
        
        arContent.innerHTML = `
            <div class="ar-view">
                <div class="ar-overlay">
                    <div style="font-size: 48px; margin-bottom: 10px;">📱</div>
                    <div>AR Camera View</div>
                    <small>Point camera at trail markers</small>
                </div>
            </div>
            
            <div class="quest-info">
                <h3 class="quest-title">Current Quest: Forest Discovery</h3>
                <p class="quest-description">
                    Find 3 hidden wildlife markers along the forest trail. 
                    Use your camera to scan QR codes and unlock nature facts!
                </p>
                <div class="quest-progress">
                    <div class="progress-bar" style="width: 66%;"></div>
                </div>
                <p class="progress-text">2 of 3 markers found</p>
            </div>
            
            <div class="trail-actions" style="padding: 0 20px;">
                <button class="action-btn primary-btn" style="width: 100%; margin-bottom: 10px;">
                    📸 Scan for Markers
                </button>
                <button class="action-btn secondary-btn" style="width: 100%;">
                    📋 View Quest Details
                </button>
            </div>
        `;
    }
    
    renderRewardsScreen() {
        const rewardsContent = document.querySelector('#rewards .screen-content');
        if (!rewardsContent) return;
        
        rewardsContent.innerHTML = `
            <div class="section-title">Your Badges</div>
            <div class="badge-grid">
                ${this.badges.map(badge => `
                    <div class="badge-item ${badge.earned ? 'earned' : 'locked'}">
                        <div class="badge-icon" style="opacity: ${badge.earned ? '1' : '0.3'}">
                            ${badge.icon}
                        </div>
                        <div class="badge-name">${badge.name}</div>
                        <div class="badge-description">${badge.description}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="leaderboard-section">
                <div class="section-title">Family Leaderboard</div>
                <div class="leaderboard-list">
                    ${this.leaderboard.map(player => `
                        <div class="leaderboard-item">
                            <div class="rank">#${player.rank}</div>
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-badges">${player.badges} badges</div>
                            </div>
                            <div class="player-score">${player.score}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderProfileScreen() {
        const profileContent = document.querySelector('#profile .screen-content');
        if (!profileContent) return;
        
        profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">👨‍👩‍👧‍👦</div>
                <h2 class="profile-name">${this.familyData.name}</h2>
                <p class="profile-subtitle">Adventure Family • Level 12</p>
            </div>
            
            <div class="section-title">Family Members</div>
            <div class="member-list">
                ${this.familyData.members.map(member => `
                    <div class="member-item">
                        <div class="member-avatar">${member.avatar}</div>
                        <div class="member-info">
                            <div class="member-name">${member.name}</div>
                            <div class="member-role">${member.role}</div>
                        </div>
                        <div class="member-badges">${member.badges} badges</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.trailsCompleted}</span>
                    <span class="stat-label">Trails</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${this.familyData.stats.badgesEarned}</span>
                    <span class="stat-label">Badges</span>
                </div>
            </div>
            
            <div class="trail-actions" style="margin-top: 20px;">
                <button class="action-btn primary-btn story-btn" style="width: 100%; margin-bottom: 10px;" data-trail-id="1">
                    📖 Read Trail Stories
                </button>
                <button class="action-btn secondary-btn ar-btn" style="width: 100%;" data-trail-id="1">
                    📱 Try AR Mode
                </button>
            </div>
        `;
    }
    
    startStoryMode(trailId) {
        const trail = this.trails.find(t => t.id == trailId);
        if (!trail) return;
        
        this.showNotification(`Starting story mode for ${trail.title}`, 'success');
        
        // Create story screen overlay
        this.showStoryModal(trail);
    }
    
    startARMode(trailId) {
        const trail = this.trails.find(t => t.id == trailId);
        if (!trail) return;
        
        this.showNotification(`Launching AR mode for ${trail.title}`, 'success');
        
        // Navigate to AR screen and update content
        this.navigateToScreen('ar');
        this.updateARScreenForTrail(trail);
    }
    
    startTrail(trailId) {
        const trail = this.trails.find(t => t.id == trailId);
        if (!trail) return;
        
        this.showNotification(`Starting adventure: ${trail.title}!`, 'success');
        
        // Navigate to map screen
        this.navigateToScreen('map');
    }
    
    showStoryModal(trail) {
        const modal = document.createElement('div');
        modal.className = 'story-modal';
        modal.innerHTML = `
            <div class="story-modal-content">
                <div class="story-header">
                    <h2>${trail.title} - Story Mode</h2>
                    <button class="close-btn" onclick="this.closest('.story-modal').remove()">✕</button>
                </div>
                <div class="story-content">
                    <h3 class="story-title">The Beginning of Your Adventure</h3>
                    <p class="story-text">
                        As you approach the ${trail.title.toLowerCase()}, you notice something unusual. 
                        The morning mist seems to dance between the trees, and you hear a mysterious sound 
                        coming from deeper within the trail. What do you do?
                    </p>
                    <div class="story-choices">
                        <button class="choice-btn" onclick="app.continueStory('investigate')">
                            🔍 Investigate the mysterious sound
                        </button>
                        <button class="choice-btn" onclick="app.continueStory('follow')">
                            👣 Follow the main trail path
                        </button>
                        <button class="choice-btn" onclick="app.continueStory('wait')">
                            ⏱️ Wait and observe quietly
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.querySelector('.story-modal-content').style.cssText = `
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modal.querySelector('.story-header').style.cssText = `
            background: var(--primary-color);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        modal.querySelector('.close-btn').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        `;
        
        document.body.appendChild(modal);
    }
    
    continueStory(choice) {
        this.showNotification(`You chose to ${choice}. Story continues...`, 'success');
        document.querySelector('.story-modal').remove();
    }
    
    updateARScreenForTrail(trail) {
        const arContent = document.querySelector('#ar .screen-content');
        if (!arContent) return;
        
        arContent.innerHTML = `
            <div class="ar-view">
                <div class="ar-overlay">
                    <div style="font-size: 48px; margin-bottom: 10px;">${trail.emoji}</div>
                    <div>AR Mode: ${trail.title}</div>
                    <small>Point camera at trail markers</small>
                </div>
            </div>
            
            <div class="quest-info">
                <h3 class="quest-title">AR Quest: ${trail.title}</h3>
                <p class="quest-description">
                    Discover hidden secrets along the ${trail.title.toLowerCase()} using augmented reality. 
                    Scan QR codes and interact with virtual elements!
                </p>
                <div class="quest-progress">
                    <div class="progress-bar" style="width: 0%;"></div>
                </div>
                <p class="progress-text">0 of 5 AR markers found</p>
            </div>
            
            <div class="trail-actions" style="padding: 0 20px;">
                <button class="action-btn primary-btn" style="width: 100%; margin-bottom: 10px;">
                    📸 Start AR Scanning
                </button>
                <button class="action-btn secondary-btn" style="width: 100%;">
                    🎯 View AR Objectives
                </button>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TrailTaleApp();
});

// Global functions for HTML onclick handlers
function navigateToStoryMode(trailId) {
    if (app) app.startStoryMode(trailId);
}

function navigateToARMode(trailId) {
    if (app) app.startARMode(trailId);
}

function startTrail(trailId) {
    if (app) app.startTrail(trailId);
}