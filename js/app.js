/**
 * Trail Tale Demo App - Clean Implementation
 * Mobile hiking trail app with story-driven adventures
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌲 Trail Tale Demo App - Starting initialization...');
    
    // Global variables
    let storyManager = null;
    
    // Main screens configuration
    const SCREENS = {
        HOME: { id: 'home', navIndex: 0 },
        MAP: { id: 'map', navIndex: 1 },
        HISTORY: { id: 'history', navIndex: 2 },
        AR: { id: 'ar', navIndex: 3 },
        STORY: { id: 'story', navIndex: 4 },
        REWARDS: { id: 'rewards', navIndex: 5 },
        PROFILE: { id: 'profile', navIndex: 6 }
    };

    // Wait for story manager to be available
    function waitForStoryManager() {
        if (window.storyManager) {
            storyManager = window.storyManager;
            storyManager.loadProgress();
            initializeApp();
            console.log('✅ Story Manager loaded successfully');
        } else {
            console.log('⏳ Waiting for Story Manager...');
            setTimeout(waitForStoryManager, 100);
        }
    }

    // Initialize the application
    function initializeApp() {
        try {
            console.log('🔧 Setting up application components...');
            
            setupNavigation();
            setupTrailSelection();
            setupStoryReading();
            setupARExperience();
            
            showAllScreens();
            navigateToScreen(SCREENS.HOME.id, SCREENS.HOME.navIndex);
            
            console.log('✅ App initialization complete');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    // Navigation system
    function navigateToScreen(screenId, navIndex) {
        console.log('🔄 Navigating to ' + screenId + ' screen');
        
        // Remove active class from all screens
        document.querySelectorAll('.app-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Add active class to target screen
        const targetScreen = document.getElementById(screenId + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            if (window.innerWidth < 1024) {
                targetScreen.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
        
        // Update navigation buttons
        updateNavigationButtons(navIndex);
    }

    function updateNavigationButtons(activeIndex) {
        document.querySelectorAll('.nav-bar').forEach(navbar => {
            Array.from(navbar.children).forEach((btn, index) => {
                btn.classList.toggle('active', index === activeIndex);
            });
        });
    }

    function showAllScreens() {
        document.querySelectorAll('.app-screen').forEach(screen => {
            screen.style.display = 'flex';
        });
        console.log('📱 Overview mode enabled - all screens visible');
    }

    function setupNavigation() {
        const mainScreens = ['home', 'map', 'history', 'ar', 'story', 'rewards', 'profile'];
        
        document.querySelectorAll('.nav-button').forEach((button, index) => {
            button.addEventListener('click', () => {
                if (index < mainScreens.length) {
                    navigateToScreen(mainScreens[index], index);
                }
            });
        });
        
        console.log('🧭 Navigation setup complete for ' + mainScreens.length + ' screens');
    }

    // Trail selection system
    function setupTrailSelection() {
        document.querySelectorAll('.select-trail-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const trailItem = this.closest('.trail-item');
                if (trailItem) {
                    const trailNameElement = trailItem.querySelector('h4');
                    if (trailNameElement) {
                        const trailName = trailNameElement.textContent.trim();
                        selectTrail(trailName);
                    }
                }
            });
        });

        document.querySelectorAll('.begin-hike-btn').forEach(btn => {
            btn.addEventListener('click', startHike);
        });
        
        console.log('🗺️ Trail selection setup complete');
    }

    function selectTrail(trailName) {
        console.log('🏔️ Trail selected: ' + trailName);
        
        if (!storyManager) {
            console.warn('❌ Story manager not available');
            return;
        }
        
        const story = storyManager.getStoryByTrail(trailName);
        if (story) {
            updateTrailDetailsScreen(story);
            navigateToScreen(SCREENS.HISTORY.id, SCREENS.HISTORY.navIndex);
        }
    }

    function updateTrailDetailsScreen(story) {
        const titleElement = document.querySelector('#history-screen .trail-header h3');
        const infoElement = document.querySelector('#history-screen .info-box p');
        
        if (titleElement) {
            titleElement.textContent = storyManager.getText(story.title);
        }
        
        if (infoElement) {
            infoElement.textContent = storyManager.getText(story.summary);
        }

        addReadStoryButton();
    }

    function addReadStoryButton() {
        const beginHikeBtn = document.querySelector('.begin-hike-btn');
        const existingReadBtn = document.querySelector('.read-story-btn');
        
        if (beginHikeBtn && !existingReadBtn) {
            const readStoryBtn = document.createElement('button');
            readStoryBtn.className = 'read-story-btn';
            readStoryBtn.innerHTML = '📖 Read Story';
            readStoryBtn.addEventListener('click', openStoryReader);
            
            beginHikeBtn.parentNode.insertBefore(readStoryBtn, beginHikeBtn.nextSibling);
        }
    }

    function startHike() {
        console.log('🥾 Starting hike...');
        
        if (!storyManager) {
            console.warn('❌ Story manager not available for hiking');
            return;
        }
        
        const titleElement = document.querySelector('#history-screen .trail-header h3');
        if (titleElement) {
            const trailName = titleElement.textContent.trim();
            const story = storyManager.getStoryByTrail(trailName);
            
            if (story) {
                storyManager.startStory(story.id);
                navigateToScreen(SCREENS.AR.id, SCREENS.AR.navIndex);
                startARQuest();
            }
        }
    }

    // Story reading system
    function setupStoryReading() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', toggleLanguage);
        }

        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        const backBtn = document.getElementById('story-back-btn');

        if (prevBtn) prevBtn.addEventListener('click', goToPreviousChapter);
        if (nextBtn) nextBtn.addEventListener('click', goToNextChapter);
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                navigateToScreen(SCREENS.HISTORY.id, SCREENS.HISTORY.navIndex);
            });
        }
        
        console.log('📚 Story reading setup complete');
    }

    function openStoryReader() {
        console.log('📖 Opening story reader...');
        
        const titleElement = document.querySelector('#history-screen .trail-header h3');
        if (titleElement && storyManager) {
            const trailName = titleElement.textContent.trim();
            const story = storyManager.getStoryByTrail(trailName);
            
            if (story) {
                storyManager.startStory(story.id);
                navigateToScreen(SCREENS.STORY.id, SCREENS.STORY.navIndex);
                updateStoryContent();
            }
        }
    }

    function updateStoryContent() {
        if (!storyManager || !storyManager.currentStory) {
            console.warn('❌ No current story available');
            return;
        }

        const chapter = storyManager.getCurrentChapter();
        if (!chapter) {
            console.warn('❌ No chapter content available');
            return;
        }

        // Update story title
        const titleElement = document.getElementById('story-title');
        if (titleElement) {
            titleElement.textContent = storyManager.getText(storyManager.currentStory.title);
        }

        // Update progress
        const progressText = document.getElementById('chapter-progress');
        const progressBar = document.getElementById('story-progress-bar');
        
        if (progressText && storyManager.currentStory) {
            progressText.textContent = 'Chapter ' + storyManager.currentStory.currentChapter + ' of ' + storyManager.currentStory.totalChapters;
        }
        
        if (progressBar && storyManager.currentStory) {
            const progress = (storyManager.currentStory.currentChapter / storyManager.currentStory.totalChapters) * 100;
            progressBar.style.width = progress + '%';
        }

        // Update content
        const contentElement = document.getElementById('story-content');
        if (contentElement) {
            const content = storyManager.getText(chapter.content);
            contentElement.innerHTML = convertMarkdownToHTML(content);
        }

        updateStoryNavigationButtons();
    }

    function updateStoryNavigationButtons() {
        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        
        if (prevBtn) {
            prevBtn.disabled = storyManager.currentStory.currentChapter <= 1;
        }
        
        if (nextBtn) {
            const hasNextChapter = storyManager.getNextChapter() !== null;
            nextBtn.disabled = !hasNextChapter;
            
            if (!hasNextChapter) {
                nextBtn.innerHTML = 'Start Adventure';
            } else {
                nextBtn.innerHTML = 'Next';
            }
        }
    }

    function goToNextChapter() {
        if (!storyManager) return;
        
        const hasNext = storyManager.getNextChapter() !== null;
        
        if (hasNext) {
            storyManager.goToNextChapter();
            updateStoryContent();
        } else {
            navigateToScreen(SCREENS.AR.id, SCREENS.AR.navIndex);
            startARQuest();
        }
    }

    function goToPreviousChapter() {
        if (!storyManager || !storyManager.currentStory) return;
        
        if (storyManager.currentStory.currentChapter > 1) {
            storyManager.currentStory.currentChapter -= 1;
            storyManager.saveProgress();
            updateStoryContent();
        }
    }

    function toggleLanguage() {
        if (!storyManager) return;
        
        const currentLang = storyManager.language;
        const newLang = currentLang === 'en' ? 'no' : 'en';
        storyManager.setLanguage(newLang);
        
        const toggleBtn = document.getElementById('language-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = newLang === 'en' ? '🇺🇸' : '🇳🇴';
        }
        
        const storyScreen = document.getElementById('story-screen');
        if (storyScreen && storyScreen.classList.contains('active')) {
            updateStoryContent();
        }
        
        console.log('🌍 Language changed to: ' + newLang);
    }

    // AR experience system
    function setupARExperience() {
        console.log('🔮 AR experience setup complete');
    }

    function startARQuest() {
        console.log('🎮 Starting AR quest...');
        
        if (!storyManager) return;
        
        const quest = storyManager.getNextQuest();
        if (quest) {
            storyManager.startQuest(quest.id);
            displayARQuest(quest);
        }
    }

    function displayARQuest(quest) {
        const arContent = document.querySelector('#ar-screen .content');
        if (!arContent) {
            console.warn('❌ AR content container not found');
            return;
        }

        const character = storyManager.getCurrentARCharacter();
        const arCharacters = storyManager.getARCharacters();
        const charData = arCharacters[character] || arCharacters['default-character'] || {
            emoji: '🧚‍♀️',
            animation: 'bounce'
        };

        arContent.innerHTML = `
            <div class="ar-simulation">
                <div class="ar-background">
                    <div class="forest-scene">
                        <div class="tree">🌲</div>
                        <div class="tree">🌳</div>
                        <div class="tree">🌲</div>
                    </div>
                </div>
                <div class="ar-character ${charData.animation}">
                    <div class="character-sprite">${charData.emoji}</div>
                </div>
                <div class="quest-bubble">
                    <div class="speech-bubble">
                        <h4>${storyManager.getText(quest.title)}</h4>
                        <p>${storyManager.getText(quest.description)}</p>
                    </div>
                </div>
                <div class="ar-controls">
                    <button class="complete-quest-btn">✅ Complete Quest</button>
                    <button class="hint-btn">💡 Hint</button>
                </div>
            </div>
        `;

        setupARControls();
    }

    function setupARControls() {
        const completeBtn = document.querySelector('.complete-quest-btn');
        const hintBtn = document.querySelector('.hint-btn');

        if (completeBtn) {
            completeBtn.addEventListener('click', completeQuest);
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', showHint);
        }
    }

    function completeQuest() {
        console.log('🎉 Quest completed!');
        
        if (!storyManager) return;
        
        storyManager.completeQuest();
        
        const bubble = document.querySelector('.speech-bubble');
        if (bubble) {
            const points = storyManager.currentQuest ? storyManager.currentQuest.points : 0;
            bubble.innerHTML = '<h4>🎉 Quest Complete!</h4><p>Great work! You earned ' + points + ' points!</p>';
        }

        setTimeout(() => {
            const nextQuest = storyManager.getNextQuest();
            if (nextQuest) {
                storyManager.startQuest(nextQuest.id);
                displayARQuest(nextQuest);
            } else {
                showStoryComplete();
            }
        }, 2000);
    }

    function showHint() {
        const bubble = document.querySelector('.speech-bubble');
        if (bubble) {
            bubble.innerHTML = '<h4>💡 Hint</h4><p>Look around you! The answer might be hiding in the trees or on the ground.</p>';
        }
    }

    function showStoryComplete() {
        console.log('🏆 Story adventure complete!');
        
        const arContent = document.querySelector('#ar-screen .content');
        if (arContent && storyManager) {
            arContent.innerHTML = `
                <div class="story-complete">
                    <div class="completion-badge">🏆</div>
                    <h3>Adventure Complete!</h3>
                    <p>You've finished this trail story!</p>
                    <div class="final-stats">
                        <div class="stat">Points: ${storyManager.userProgress.totalPoints}</div>
                        <div class="stat">Level: ${storyManager.userProgress.currentLevel}</div>
                    </div>
                    <button class="return-home-btn">Return to Home</button>
                </div>
            `;

            const returnBtn = document.querySelector('.return-home-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    navigateToScreen(SCREENS.HOME.id, SCREENS.HOME.navIndex);
                });
            }
        }
    }

    // Simple markdown to HTML converter (avoiding complex regex)
    function convertMarkdownToHTML(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Simple replacements without complex regex
        html = html.split('**').map((part, index) => {
            return index % 2 === 1 ? '<strong>' + part + '</strong>' : part;
        }).join('');
        
        html = html.split('*').map((part, index) => {
            if (index % 2 === 1 && !part.includes('<strong>')) {
                return '<em>' + part + '</em>';
            }
            return part;
        }).join('');
        
        // Handle paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '');
        
        return html;
    }

    function updateHomeScreen() {
        if (!storyManager) return;
        
        const levelNumber = document.querySelector('.level-number');
        if (levelNumber) {
            levelNumber.textContent = storyManager.userProgress.currentLevel;
        }

        const hikeOptions = document.querySelectorAll('.hike-option');
        const stories = storyManager.getAvailableStories();
        
        hikeOptions.forEach((option, index) => {
            if (stories[index]) {
                const titleEl = option.querySelector('h5');
                const difficultyEl = option.querySelector('.difficulty');
                const durationEl = option.querySelector('.duration');
                
                if (titleEl) titleEl.textContent = storyManager.getText(stories[index].title);
                if (difficultyEl) difficultyEl.textContent = stories[index].difficulty;
                if (durationEl) durationEl.textContent = stories[index].duration;
            }
        });
    }

    // Start the initialization process
    waitForStoryManager();

    // Global functions for debugging
    window.TrailTaleApp = {
        navigateToScreen: navigateToScreen,
        storyManager: () => storyManager,
        screens: SCREENS
    };

    console.log('✅ Trail Tale Demo App loaded successfully');
});
