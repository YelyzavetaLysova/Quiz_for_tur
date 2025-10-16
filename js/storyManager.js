/**
 * Story Manager for Trail Tale Demo
 * Simplified version for demo purposes - handles story progression and AR quests
 */

// Example stories data
const exampleStories = {
  "Enchanted Forest Loop": {
    id: "story-forest-adventure",
    title: { en: "The Forest Guardian's Quest", no: "Skogvokternes oppdrag" },
    summary: { en: "Follow magical creatures through the ancient forest and help them solve environmental puzzles.", no: "Følg magiske skapninger gjennom den gamle skogen og hjelp dem med å løse miljøgåter." },
    genre: "fantasy",
    location: "Enchanted Forest Loop",
    difficulty: "medium",
    duration: "45 min",
    quests: [
      {
        id: "quest-1",
        title: { en: "Find the Glimmerstone", no: "Finn glimmersteinen" },
        description: { en: "Look for the magical stone that glows when touched by sunlight", no: "Se etter den magiske steinen som glitrer når den berøres av sollys" },
        type: "observe",
        points: 100,
        arCharacter: "forest-sprite",
        completed: false
      },
      {
        id: "quest-2", 
        title: { en: "Help the Lost Owl", no: "Hjelp den forkomne ugla" },
        description: { en: "Guide the wise owl back to its ancient tree home", no: "Hjelp den kloke ugla tilbake til sitt gamle trehjem" },
        type: "solve",
        points: 150,
        arCharacter: "wise-owl",
        completed: false
      }
    ],
    totalPoints: 250,
    currentChapter: 1,
    totalChapters: 5
  },
  "Riverside Discovery": {
    id: "story-river-discovery",
    title: { en: "Riverside Mysteries", no: "Elvens mysterier" },
    summary: { en: "Discover the secrets of the ancient river and its wildlife inhabitants.", no: "Oppdag hemmelighetene til den gamle elva og dens dyreliv." },
    genre: "educational",
    location: "Riverside Discovery", 
    difficulty: "easy",
    duration: "30 min",
    quests: [
      {
        id: "quest-3",
        title: { en: "Track Animal Footprints", no: "Spor dyrespor" },
        description: { en: "Find and identify different animal tracks near the water", no: "Finn og identifiser forskjellige dyrespor nær vannet" },
        type: "observe",
        points: 75,
        arCharacter: "river-otter",
        completed: false
      }
    ],
    totalPoints: 150,
    currentChapter: 1,
    totalChapters: 3
  },
  "Mountain View Challenge": {
    id: "story-mountain-challenge",
    title: { en: "Mountain Peak Adventure", no: "Fjelltopp eventyr" },
    summary: { en: "Climb to new heights and discover the legends of the mountain spirits.", no: "Klatre til nye høyder og oppdag legendene om fjellåndene." },
    genre: "historical",
    location: "Mountain View Challenge",
    difficulty: "hard", 
    duration: "90 min",
    quests: [
      {
        id: "quest-4",
        title: { en: "Ancient Stone Circle", no: "Gamle steinsirkel" },
        description: { en: "Discover the meaning behind the mysterious stone formations", no: "Oppdag betydningen bak de mystiske steinformasjonene" },
        type: "solve",
        points: 200,
        arCharacter: "mountain-spirit",
        completed: false
      }
    ],
    totalPoints: 300,
    currentChapter: 1,
    totalChapters: 4
  }
};

class StoryManager {
  constructor() {
    this.currentStory = null;
    this.currentQuest = null;
    this.userProgress = {
      totalPoints: 450,
      completedQuests: 3,
      currentLevel: 8,
      completedStories: []
    };
    this.language = 'en';
  }

  getAvailableStories() {
    return Object.values(exampleStories);
  }

  startStory(storyId) {
    const stories = this.getAvailableStories();
    this.currentStory = stories.find(story => story.id === storyId);
    
    if (this.currentStory) {
      this.currentQuest = null;
      this.saveProgress();
      return this.currentStory;
    }
    return null;
  }

  getCurrentStory() {
    return this.currentStory;
  }

  startQuest(questId) {
    if (!this.currentStory) return null;
    
    this.currentQuest = this.currentStory.quests.find(quest => quest.id === questId);
    this.saveProgress();
    return this.currentQuest;
  }

  completeQuest() {
    if (!this.currentQuest) return false;
    
    this.currentQuest.completed = true;
    this.userProgress.totalPoints += this.currentQuest.points;
    this.userProgress.completedQuests += 1;
    
    const newLevel = Math.floor(this.userProgress.totalPoints / 100) + 1;
    if (newLevel > this.userProgress.currentLevel) {
      this.userProgress.currentLevel = newLevel;
    }
    
    this.saveProgress();
    return true;
  }

  getNextQuest() {
    if (!this.currentStory) return null;
    
    const incompleteQuests = this.currentStory.quests.filter(quest => !quest.completed);
    return incompleteQuests.length > 0 ? incompleteQuests[0] : null;
  }

  getCurrentARCharacter() {
    if (!this.currentQuest) return null;
    return this.currentQuest.arCharacter || 'default-character';
  }

  getText(textObj) {
    return textObj[this.language] || textObj.en;
  }

  setLanguage(lang) {
    this.language = lang;
  }

  saveProgress() {
    const progressData = {
      currentStory: this.currentStory,
      currentQuest: this.currentQuest,
      userProgress: this.userProgress,
      language: this.language
    };
    localStorage.setItem('trailTaleProgress', JSON.stringify(progressData));
  }

  loadProgress() {
    const saved = localStorage.getItem('trailTaleProgress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.currentStory = data.currentStory;
        this.currentQuest = data.currentQuest;
        this.userProgress = data.userProgress || this.userProgress;
        this.language = data.language || 'en';
      } catch (e) {
        console.log('Error loading progress:', e);
      }
    }
  }

  getStoryByTrail(trailName) {
    return exampleStories[trailName] || null;
  }

  getARCharacters() {
    return {
      'forest-sprite': {
        emoji: '🧚‍♀️',
        color: '#4CAF50',
        animation: 'bounce'
      },
      'wise-owl': {
        emoji: '🦉',
        color: '#8D6E63',
        animation: 'sway'
      },
      'river-otter': {
        emoji: '🦦',
        color: '#2196F3',
        animation: 'swim'
      },
      'mountain-spirit': {
        emoji: '⛰️',
        color: '#795548',
        animation: 'glow'
      },
      'default-character': {
        emoji: '✨',
        color: '#FFC107',
        animation: 'sparkle'
      }
    };
  }

  // Add full story content for each story
  getStoryChapters() {
    const storyChapters = {
      "story-forest-adventure": [
        {
          chapter: 1,
          title: { en: "The Awakening Forest", no: "Den våknende skogen" },
          content: {
            en: `# Chapter 1: The Awakening Forest

The morning mist clings to the ancient pines as your family steps onto the forest trail. The air is crisp and filled with the earthy scent of moss and fallen leaves.

**Emma notices something glittering between the trees...**

"Look!" she whispers, pointing to a small clearing where shafts of sunlight dance through the canopy. "There's something magical happening here."

As you approach, you see tiny sparkles of light moving between the branches. The forest seems alive with an energy you've never felt before.

**Your first quest awaits...**`,
            no: `# Kapittel 1: Den våknende skogen

Morgentåken henger ved de gamle furutrærne mens familien din går inn på skogsveien. Luften er frisk og fylt med den jordnære lukten av mose og falne blader.

**Emma legger merke til noe som glitrer mellom trærne...**

"Se!" hvisker hun og peker mot en liten lysning hvor sollys danser gjennom løvverket. "Det skjer noe magisk her."

Når dere nærmer dere, ser dere små gnister av lys som beveger seg mellom grenene. Skogen virker levende med en energi dere aldri har følt før.

**Deres første oppdrag venter...**`
          }
        },
        {
          chapter: 2,
          title: { en: "The Guardian's Secret", no: "Vokternes hemmelighet" },
          content: {
            en: `# Chapter 2: The Guardian's Secret

After finding the Glimmerstone, a soft voice echoes through the trees. A forest sprite appears, no bigger than your hand, with wings that shimmer like dewdrops.

"Thank you for awakening the stone," the sprite says in a voice like tinkling bells. "I am Luna, guardian of this ancient grove."

She explains that the forest has been sleeping for many years, waiting for a family brave enough to help restore its magic.

**Your next challenge will test your wisdom...**`,
            no: `# Kapittel 2: Vokternes hemmelighet

Etter å ha funnet Glimmersteinen, ekko en myk stemme gjennom trærne. En skogsnisse dukker opp, ikke større enn hånden din, med vinger som skimrer som duggdråper.

"Takk for at dere vekket steinen," sier nissen med en stemme som klingende bjeller. "Jeg er Luna, vokter av denne gamle lunden."

Hun forklarer at skogen har sovet i mange år, og ventet på en familie modig nok til å hjelpe med å gjenopprette magien.

**Deres neste utfordring vil teste visdom...**`
          }
        }
      ],
      "story-river-discovery": [
        {
          chapter: 1,
          title: { en: "Tracks by the Water", no: "Spor ved vannet" },
          content: {
            en: `# Chapter 1: Tracks by the Water

The gentle sound of flowing water guides your family to the riverbank. The morning sun creates dancing reflections on the water's surface.

**Sam kneels down by the muddy shore...**

"These look like animal tracks!" he exclaims, pointing to small impressions in the soft earth. The prints lead both toward and away from the water.

A curious otter pops its head above the water, watching your family with bright, intelligent eyes.

**Time to become nature detectives...**`,
            no: `# Kapittel 1: Spor ved vannet

Den milde lyden av rennende vann leder familien din til elvebredden. Morgensolen skaper dansende refleksjoner på vannoverflaten.

**Sam kneler ned ved den gjørmete bredden...**

"Dette ser ut som dyrespor!" utbryter han og peker på små avtrykk i den myke jorden. Sporene leder både mot og bort fra vannet.

En nysgjerrig oter stikker hodet opp over vannet og ser på familien deres med lyse, intelligente øyne.

**Tid for å bli naturdetektiver...**`
          }
        }
      ],
      "story-mountain-challenge": [
        {
          chapter: 1,
          title: { en: "Stones of the Ancients", no: "De gamles steiner" },
          content: {
            en: `# Chapter 1: Stones of the Ancients

The mountain path winds upward through rocky terrain. Your family climbs steadily, each step bringing you closer to the mysterious stone circle mentioned in local legends.

**Dad stops to catch his breath and points ahead...**

"Look at those stones," he says, awe in his voice. "They're arranged in a perfect circle, just like the old stories said."

The ancient stones seem to hum with energy, and you can feel the weight of centuries in this sacred place.

**The mountain spirits are waiting...**`,
            no: `# Kapittel 1: De gamles steiner

Fjellstien snor seg oppover gjennom steinete terreng. Familien klatrer stødig, hvert skritt bringer dere nærmere den mystiske steinsirkelen nevnt i lokale legender.

**Pappa stopper for å hente pusten og peker fremover...**

"Se på de steinene," sier han med ærefrykt i stemmen. "De er arrangert i en perfekt sirkel, akkurat som de gamle fortellingene sa."

De gamle steinene virker å summe med energi, og dere kan føle tyngden av århundrer på dette hellige stedet.

**Fjellåndene venter...**`
          }
        }
      ]
    };
    
    return storyChapters[this.currentStory?.id] || [];
  }
  
  getCurrentChapter() {
    if (!this.currentStory) return null;
    const chapters = this.getStoryChapters();
    return chapters[this.currentStory.currentChapter - 1] || chapters[0];
  }
  
  getNextChapter() {
    if (!this.currentStory) return null;
    const chapters = this.getStoryChapters();
    const nextChapterIndex = this.currentStory.currentChapter;
    return chapters[nextChapterIndex] || null;
  }
  
  goToNextChapter() {
    if (!this.currentStory) return false;
    const chapters = this.getStoryChapters();
    if (this.currentStory.currentChapter < chapters.length) {
      this.currentStory.currentChapter += 1;
      this.saveProgress();
      return true;
    }
    return false;
  }
}

// Create global instance for demo
window.storyManager = new StoryManager();
