# Trail Tale - Simple Hiking Adventure Demo

A clean, simple mobile web app that demonstrates a hiking trail experience with stories and interactive quests.

## 🎯 What This Demo Shows

### Core Features
- **Trail Selection** - Choose from 3 different hiking adventures
- **Interactive Stories** - Bilingual stories (English/Norwegian) 
- **AR Quest System** - Simple 2D character animations with quests
- **Progress Tracking** - Points, levels, and quest completion
- **Mobile UI** - Clean, responsive design that feels like a native app

### 3 Demo Stories
1. **Enchanted Forest Loop** 🧚‍♀️ - Fantasy adventure with forest sprites
2. **Riverside Discovery** 🦦 - Educational trail about water ecosystems  
3. **Mountain View Challenge** ⛰️ - Historical journey with mountain spirits

## 🚀 Try the Demo

### Quick Start
```bash
# Start local server
npx http-server

# Or use Python
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

### How to Use
1. **Select a trail** from the Map screen
2. **View trail details** and click "Begin hike"
3. **Complete AR quests** with animated characters
4. **Earn points** and progress through the adventure

### Demo Controls
Use the **Demo Controls** panel (top-right) to:
- **Test AR Quest** - Jump straight to the AR experience
- **Reset Progress** - Start fresh

## 📱 App Screens

- **Home** - Family progress and trail suggestions
- **Map** - Interactive trail selection
- **Trail Details** - Story preview and hike start
- **AR Experience** - Animated quests with characters
- **Rewards** - Leaderboard and achievements  
- **Profile** - Family statistics

## 🛠 Technical Details

### Simple Architecture
- **Pure HTML/CSS/JavaScript** - No frameworks or complex dependencies
- **3 Core Files**:
  - `js/storyManager.js` - Story data and quest logic
  - `js/app.js` - Navigation and AR experience
  - `js/demo.js` - Demo controls
- **Clean CSS** - Responsive mobile-first design

### Story System
```javascript
// Each story has quests with AR characters
{
  title: { en: "Quest Title", no: "Norwegian Title" },
  quests: [
    { 
      arCharacter: "forest-sprite", // 🧚‍♀️
      type: "observe",
      points: 100
    }
  ]
}
```

### AR Characters
- 🧚‍♀️ **Forest Sprite** - Bouncing animation
- 🦉 **Wise Owl** - Swaying animation  
- 🦦 **River Otter** - Swimming animation
- ⛰️ **Mountain Spirit** - Glowing animation

## 🎮 User Flow

1. **Home Screen** → View family progress
2. **Map Screen** → Select "Enchanted Forest Loop"
3. **Trail Details** → Click "Begin hike"
4. **AR Experience** → Meet forest sprite → Complete quest
5. **Next Quest** → Meet wise owl → Complete adventure
6. **Completion** → Earn points → Return home

## 📂 File Structure

```
Trail Tale Demo/
├── index.html          # Main app structure
├── css/styles.css      # Clean, responsive styles
└── js/
    ├── storyManager.js # Story data & quest logic
    ├── app.js          # Navigation & AR system
    └── demo.js         # Demo controls
```

## 🌟 Perfect For

- **Portfolio demonstrations**
- **Client presentations** 
- **Concept validation**
- **Foundation for real hiking app**

---

**Simple. Clean. Functional.** This demo shows how technology can enhance outdoor family adventures! 🌲✨
- Family profile with statistics and member management

## Screens

1. **Home Screen**: Overview of nearby tours, events, and rewards
2. **Map/AR Screen**: Shows the route with AR elements, tasks, and trail history 
3. **History Screen**: Engaging content with illustrations and short texts
4. **AR Screen**: Shows the route with AR elements, tasks, and history
5. **Rewards/Badges Screen**: Overview of earned badges and progress
6. **Family Profile**: Collective overview of progress for parents and children

## Usage

Open `index.html` in your web browser to view the application. The interface is designed to simulate a mobile app experience.

## Navigation

Use the bottom navigation bar to switch between different screens:
- Home (house icon)
- Map (map icon)
- History (history icon)
- Settings/Rewards (gear icon)
- Profile (user icon)

## Development

This is a prototype built with HTML, CSS, and JavaScript. The design is based on the provided screenshot and follows modern mobile app design principles.

### Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome for icons

## License

This is a demo project created based on the provided screenshot.

## Quick start (serve locally)

You can open `index.html` directly in a browser, but it's nicer to run a small local HTTP server so relative assets and routing work correctly.

- Using Node (recommended):

	- If you have Node.js installed, run:

		```powershell
		npx http-server -c-1 .
		```

	- Open http://localhost:8080 in your browser.

- Using Python 3 (if available):

	```powershell
	python -m http.server 8080
	```

	- Open http://localhost:8080 in your browser.

Note: This is a demo/prototype. Not production-ready — the app uses static demo data and is intended for showcasing UI and interactions only.
