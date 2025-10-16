/**
 * Story Schema for Trail Tale app
 * Defines the structure for generated stories with bilingual support and quest integration
 */

/**
 * Complete story object schema
 * @typedef {Object} StoryObject
 * @property {string} id - Unique identifier for the story
 * @property {BilingualContent} title - Story title in English and Norwegian
 * @property {BilingualContent} summary - Brief story summary (50-100 words)
 * @property {BilingualContent} body - Full story content in Markdown format
 * @property {string} genre - "educational" | "historical" | "fantasy"
 * @property {number[]} ageRange - Min and max age range, e.g. [12, 14]
 * @property {number} wordCount - Approximate word count for the English version
 * @property {string} readingLevel - Estimated reading level (e.g., "Grade 7-8")
 * @property {string[]} tags - Content tags for categorization
 * @property {Quest[]} quests - Array of interactive quest points
 * @property {string} location - Location name the story is associated with
 * @property {WeatherCondition} weather - Weather conditions for this story
 * @property {string} promptHash - Hash of original prompt for reproducibility
 * @property {Safety} safety - Moderation info and safety checks
 * @property {string} createdAt - ISO timestamp of creation
 * @property {boolean} saved - Whether user saved this story
 * @property {StorySetting} setting - Location and trail-specific setting details
 */

/**
 * Bilingual content wrapper
 * @typedef {Object} BilingualContent
 * @property {string} en - English content
 * @property {string} no - Norwegian content
 */

/**
 * Quest/checkpoint in the story
 * @typedef {Object} Quest
 * @property {string} id - Unique quest identifier
 * @property {BilingualContent} title - Quest title
 * @property {BilingualContent} description - Quest description
 * @property {string} type - "observe" | "collect" | "solve" | "photo" | "ar"
 * @property {BilingualContent} cue - Text cue for when to trigger this quest
 * @property {BilingualContent} completion - Text for quest completion
 * @property {number} points - Points awarded for completion
 * @property {string} [arAssetId] - Optional ID for AR asset to display
 * @property {number[]} [gpsCoordinates] - Optional lat/long for location trigger
 * @property {string} [locationHint] - Text hint about where to find this point
 */

/**
 * Weather condition for the story
 * @typedef {Object} WeatherCondition
 * @property {string} condition - "sunny" | "rainy" | "cloudy" | "snowy" | "foggy"
 * @property {number} temperatureC - Temperature in Celsius
 * @property {boolean} isRainLikely - Chance of precipitation
 * @property {string} [description] - Optional detailed weather description
 */

/**
 * Safety and moderation info
 * @typedef {Object} Safety
 * @property {number} [score] - 0-1 safety score (higher = safer)
 * @property {boolean} flagged - Whether content was flagged as potentially unsafe
 * @property {string[]} [reasons] - Reasons for flagging, if any
 * @property {boolean} reviewed - Whether a human has reviewed this story
 */

/**
 * Location and trail-specific details
 * @typedef {Object} StorySetting
 * @property {string} region - Geographic region (e.g., "Bergen area") 
 * @property {string} [trailName] - Name of the specific trail
 * @property {string} terrain - "forest" | "mountain" | "coastal" | "urban" | "mixed"
 * @property {string} difficulty - "easy" | "moderate" | "challenging"
 * @property {string[]} landmarks - Notable landmarks to mention in the story
 */

/**
 * Family profile for personalization
 * @typedef {Object} FamilyProfile
 * @property {string} familyName - Family surname
 * @property {FamilyMember[]} members - Array of family members
 */

/**
 * Family member for story personalization
 * @typedef {Object} FamilyMember 
 * @property {string} name - First name
 * @property {string} role - "child" | "parent" | "grandparent" | "other"
 * @property {number} age - Age in years
 */

/**
 * Sample story object (for reference)
 */
const sampleStory = {
  id: "story-123456",
  title: {
    en: "The Hidden Treasure of Bergen Forest",
    no: "Den skjulte skatten i Bergen skog"
  },
  summary: {
    en: "Join the Thompson family on an adventure through the ancient forests near Bergen, where legends of Viking treasure await discovery through puzzles and exploration.",
    no: "Bli med Thompson-familien på et eventyr gjennom de gamle skogene nær Bergen, hvor legender om vikingskatter venter på å bli oppdaget gjennom gåter og utforskning."
  },
  body: {
    en: "# The Hidden Treasure of Bergen Forest\n\nThe sun filtered through the ancient pines as the Thompson family stepped onto the forest trail...",
    no: "# Den skjulte skatten i Bergen skog\n\nSolen filtrerte gjennom de gamle furutrærne mens Thompson-familien gikk inn på skogsveien..."
  },
  genre: "fantasy",
  ageRange: [12, 16],
  wordCount: 1250,
  readingLevel: "Grade 7-8",
  tags: ["adventure", "vikings", "treasure", "family", "puzzle"],
  quests: [
    {
      id: "q1",
      title: { 
        en: "Decipher the Runes", 
        no: "Tyde runene" 
      },
      description: { 
        en: "Find the stone with ancient Viking runes and decode the message using the key in your story.", 
        no: "Finn steinen med gamle vikingruner og dekod meldingen ved å bruke nøkkelen i historien din." 
      },
      type: "solve",
      cue: { 
        en: "When you reach the large boulder with strange markings...", 
        no: "Når du når den store steinen med merkelige tegn..." 
      },
      completion: { 
        en: "You've solved the ancient riddle! The runes point toward the next marker.", 
        no: "Du har løst den gamle gåten! Runene peker mot den neste markøren." 
      },
      points: 50,
      locationHint: "Look for the large moss-covered rock about 1km into the trail"
    },
    // More quests...
  ],
  location: "Bergen Forest Trail",
  weather: {
    condition: "cloudy",
    temperatureC: 12,
    isRainLikely: true,
    description: "Light clouds with occasional drizzle"
  },
  promptHash: "f7c3bc1d808e04732adf679965ccc34ca7ae3441",
  safety: {
    score: 0.98,
    flagged: false,
    reviewed: false
  },
  createdAt: "2025-10-09T15:30:22Z",
  saved: false,
  setting: {
    region: "Bergen",
    trailName: "Forest Heritage Path",
    terrain: "forest",
    difficulty: "moderate",
    landmarks: ["Ancient oak tree", "Viking stone marker", "Small waterfall", "Moss-covered boulders"]
  }
};

// Export schema for use in the application
export const storySchema = {
  version: "1.0.0",
  sampleStory
};