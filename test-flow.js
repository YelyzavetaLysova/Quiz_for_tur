// Test script to verify application flow
console.log('🧪 Testing Trail Tale Application Flow...');

// Test 1: Check if all screens are visible
setTimeout(() => {
    const screens = document.querySelectorAll('.app-screen');
    console.log(`✅ Found ${screens.length} screens`);
    
    // Test 2: Check navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    console.log(`✅ Found ${navButtons.length} navigation buttons`);
    
    // Test 3: Check story manager
    if (window.storyManager) {
        console.log('✅ Story Manager loaded');
        console.log(`📚 Available stories: ${window.storyManager.getAvailableStories().length}`);
    } else {
        console.log('❌ Story Manager not found');
    }
    
    // Test 4: Test navigation
    if (navButtons.length > 0) {
        console.log('🔄 Testing navigation...');
        navButtons[1].click(); // Click map
        setTimeout(() => {
            navButtons[2].click(); // Click history
            setTimeout(() => {
                navButtons[0].click(); // Back to home
                console.log('✅ Navigation test complete');
            }, 1000);
        }, 1000);
    }
    
}, 2000);
