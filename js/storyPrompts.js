/**
 * Prompt Templates for Trail Tale Stories
 * 
 * This file contains templates for generating educational, historical, and fantasy stories
 * using Cohere's API. Each template is designed to create bilingual (English/Norwegian) stories
 * with interactive elements and quest points that match the Trail Tale hiking app experience.
 */

/**
 * Base prompt configuration that applies to all story types
 */
const basePromptConfig = {
  // Cohere API parameters
  model: "command-r-plus", // Or your preferred Cohere model
  maxTokens: 3000,         // Adjust based on story length needs
  temperature: 0.75,       // Higher = more creative, lower = more deterministic
  topP: 0.95,
  topK: 0,                 // 0 means no filtering
  stopSequences: ["###"],  // To signal the end of content
  
  // Content constraints that apply to all stories
  contentConstraints: `
    - Create a bilingual story in both English (en) and Norwegian (no)
    - Target reading level should match the specified age range
    - Include 2-3 interactive quest points that families can complete while hiking
    - Avoid sensitive topics: graphic violence, trauma, sexuality, politics, religion
    - Include sensory descriptions of the environment that match the weather conditions
    - Use the family members' names and ages to create relatable characters
    - Create an engaging narrative that's educational while being fun to read
    - For Norwegian text, use standard Bokmål with occasional local Bergen expressions
  `,

  // Output formatting instructions
  outputFormat: `
    Return a JSON object with the following structure (do not include backticks or "json" markers):
    {
      "title": { 
        "en": "English title", 
        "no": "Norwegian title" 
      },
      "summary": { 
        "en": "English summary (50-100 words)", 
        "no": "Norwegian summary (50-100 words)" 
      },
      "body": { 
        "en": "Full English story in Markdown format, including section headings", 
        "no": "Full Norwegian translation in Markdown format, with the same structure" 
      },
      "wordCount": approximate word count,
      "readingLevel": "Grade X-Y",
      "tags": ["tag1", "tag2", "tag3"],
      "quests": [
        {
          "title": { "en": "Quest title", "no": "Norwegian quest title" },
          "description": { "en": "What to do", "no": "Norwegian description" },
          "type": "observe|collect|solve|photo",
          "cue": { "en": "When to trigger this quest", "no": "Norwegian cue" },
          "completion": { "en": "Completion text", "no": "Norwegian completion" },
          "points": points to award (integer),
          "locationHint": "Where to find this point"
        }
      ]
    }
  `
};

/**
 * Educational story prompt template
 * 
 * @param {Object} params Story generation parameters
 * @returns {Object} Complete prompt for Cohere API
 */
function createEducationalStoryPrompt(params) {
  const { location, weather, familyProfile, ageRange, storyLength = "medium" } = params;
  
  // Calculate target word count based on age and requested length
  const wordCountMap = {
    short: { younger: 600, older: 800 },
    medium: { younger: 1000, older: 1500 },
    long: { younger: 1800, older: 2500 }
  };
  
  const isOlder = ageRange[1] >= 14;
  const targetWordCount = wordCountMap[storyLength][isOlder ? "older" : "younger"];
  
  // Customize educational topics based on location
  const educationalTopics = getLocationBasedTopics(location);

  // Build the system prompt for educational stories
  const systemPrompt = `
    You are an expert educational story writer who creates engaging, factually accurate content for young hikers aged ${ageRange[0]}-${ageRange[1]}.
    Create a bilingual educational adventure story that teaches about ${educationalTopics.join(", ")} while taking place in ${location} during ${weather.condition} weather.
    
    The story should:
    - Target approximately ${targetWordCount} words (English version)
    - Use age-appropriate vocabulary and concepts for ${ageRange[0]}-${ageRange[1]} year olds
    - Weave educational facts seamlessly into an engaging narrative
    - Feature the ${familyProfile.familyName} family, including ${formatFamilyMembers(familyProfile.members)}
    - Include 2-3 educational activities as "quests" that teach through observation and interaction
    - Connect the narrative to the real-world location (${location}) and current weather (${weather.condition}, ${weather.temperatureC}°C)
    - Balance entertainment and education - should be fun first, educational second

    ${basePromptConfig.contentConstraints}
  `;

  const userPrompt = `
    Write a bilingual educational story (English and Norwegian) about a family hike in ${location}.
    
    Location details: ${location}
    Weather: ${weather.condition}, ${weather.temperatureC}°C, ${weather.isRainLikely ? "chance of rain" : "dry"}
    Family: ${formatFamilyMembers(familyProfile.members)}
    Educational focus: ${educationalTopics.join(", ")}
    
    Include at least two quest checkpoints where the family can stop and complete an educational activity related to the story.
    
    ${basePromptConfig.outputFormat}
  `;

  return {
    ...basePromptConfig,
    prompt: userPrompt,
    systemPrompt: systemPrompt
  };
}

/**
 * Historical story prompt template
 * 
 * @param {Object} params Story generation parameters
 * @returns {Object} Complete prompt for Cohere API
 */
function createHistoricalStoryPrompt(params) {
  const { location, weather, familyProfile, ageRange, storyLength = "medium" } = params;
  
  // Calculate target word count based on age and requested length
  const wordCountMap = {
    short: { younger: 700, older: 900 },
    medium: { younger: 1200, older: 1800 },
    long: { younger: 2000, older: 2800 }
  };
  
  const isOlder = ageRange[1] >= 14;
  const targetWordCount = wordCountMap[storyLength][isOlder ? "older" : "younger"];
  
  // Get historical elements based on location
  const historicalElements = getLocationHistoricalElements(location);

  // Build the system prompt for historical stories
  const systemPrompt = `
    You are a masterful historical fiction writer creating engaging, historically accurate stories for readers aged ${ageRange[0]}-${ageRange[1]}.
    Write a bilingual historical adventure story set in ${location} that incorporates factual historical elements about ${historicalElements.period} (${historicalElements.years}).
    
    The story should:
    - Target approximately ${targetWordCount} words (English version)
    - Transport readers to ${historicalElements.period} while maintaining a connection to the present day
    - Be historically accurate regarding events, customs, and details from ${historicalElements.period}
    - Feature the modern-day ${familyProfile.familyName} family discovering historical connections during their hike
    - Include 2-3 historical investigation activities as "quests" that reveal history through exploration
    - Reflect how the current weather (${weather.condition}, ${weather.temperatureC}°C) affects their experience
    - Create a meaningful connection between past and present

    ${basePromptConfig.contentConstraints}
  `;

  const userPrompt = `
    Write a bilingual historical fiction story (English and Norwegian) about a family discovering the history of ${location} during their hike.
    
    Location: ${location}
    Weather: ${weather.condition}, ${weather.temperatureC}°C, ${weather.isRainLikely ? "chance of rain" : "dry"}
    Family: ${formatFamilyMembers(familyProfile.members)}
    Historical period: ${historicalElements.period} (${historicalElements.years})
    Historical elements: ${historicalElements.elements.join(", ")}
    
    Include at least two quest checkpoints where the family discovers historical artifacts or locations that reveal more about the area's past.
    
    ${basePromptConfig.outputFormat}
  `;

  return {
    ...basePromptConfig,
    prompt: userPrompt,
    systemPrompt: systemPrompt
  };
}

/**
 * Fantasy story prompt template
 * 
 * @param {Object} params Story generation parameters
 * @returns {Object} Complete prompt for Cohere API
 */
function createFantasyStoryPrompt(params) {
  const { location, weather, familyProfile, ageRange, storyLength = "medium" } = params;
  
  // Calculate target word count based on age and requested length
  const wordCountMap = {
    short: { younger: 800, older: 1000 },
    medium: { younger: 1500, older: 2000 },
    long: { younger: 2500, older: 3200 }
  };
  
  const isOlder = ageRange[1] >= 14;
  const targetWordCount = wordCountMap[storyLength][isOlder ? "older" : "younger"];
  
  // Get fantasy elements based on location
  const fantasyElements = getLocationFantasyElements(location);

  // Build the system prompt for fantasy stories
  const systemPrompt = `
    You are a brilliant fantasy writer creating immersive, magical adventures for readers aged ${ageRange[0]}-${ageRange[1]}.
    Create a bilingual fantasy adventure story set in ${location} that transforms the real hiking location into a magical realm.
    
    The story should:
    - Target approximately ${targetWordCount} words (English version)
    - Blend reality and fantasy by transforming real ${location} landmarks into magical elements
    - Feature the ${familyProfile.familyName} family discovering they have special abilities or roles in this magical realm
    - Include fantasy elements appropriate for ${ageRange[0]}-${ageRange[1]} year olds (magical but not too scary)
    - Use the current weather (${weather.condition}, ${weather.temperatureC}°C) as a magical plot element
    - Include 2-3 magical challenges or puzzles as "quests" that must be solved along the trail
    - Have a positive message about family cooperation, nature appreciation, or personal growth

    ${basePromptConfig.contentConstraints}
  `;

  const userPrompt = `
    Write a bilingual fantasy adventure story (English and Norwegian) about a family discovering magic during their hike in ${location}.
    
    Location: ${location}
    Weather: ${weather.condition}, ${weather.temperatureC}°C, ${weather.isRainLikely ? "magical rain" : "clear skies with magical elements"}
    Family: ${formatFamilyMembers(familyProfile.members)}
    Fantasy elements: ${fantasyElements.join(", ")}
    
    Include at least two magical quest checkpoints where the family must solve puzzles or overcome challenges using their special abilities.
    
    ${basePromptConfig.outputFormat}
  `;

  return {
    ...basePromptConfig,
    prompt: userPrompt,
    systemPrompt: systemPrompt
  };
}

/**
 * Helper function to format family members into readable text
 * @param {Array} members Array of family members
 * @returns {String} Formatted string describing family
 */
function formatFamilyMembers(members) {
  if (!members || members.length === 0) return "members";
  
  return members.map(member => {
    return `${member.name} (${member.age}, ${member.role})`;
  }).join(", ");
}

/**
 * Helper function to get educational topics based on location
 * Placeholder implementation - would be replaced with actual location database
 * @param {String} location Location name
 * @returns {Array} Array of educational topics
 */
function getLocationBasedTopics(location) {
  // This would be replaced with a proper location database lookup
  const locationTopics = {
    "Bergen": ["local flora and fauna", "Norwegian ecosystems", "mountain geology", "coastal ecology"],
    "Bergen Forest Trail": ["forest ecosystems", "Norwegian woodland plants", "sustainable forestry"],
    "Fløyen": ["mountain formation", "Bergen city geography", "alpine ecosystems"],
    "Ulriken": ["mountain geology", "weather patterns", "alpine plant adaptation"]
  };
  
  // Default topics if location not found
  const defaultTopics = ["local nature", "ecosystems", "environmental conservation", "geology"];
  
  return locationTopics[location] || defaultTopics;
}

/**
 * Helper function to get historical elements based on location
 * Placeholder implementation - would be replaced with actual location database
 * @param {String} location Location name
 * @returns {Object} Historical period and elements
 */
function getLocationHistoricalElements(location) {
  // This would be replaced with a proper location database lookup
  const locationHistory = {
    "Bergen": {
      period: "Hanseatic League era",
      years: "1350-1750",
      elements: ["trading history", "Bryggen wharf", "merchant culture", "fishing industry"]
    },
    "Bergen Forest Trail": {
      period: "Viking Age",
      years: "800-1066",
      elements: ["ancient settlements", "Viking forest usage", "traditional crafts"]
    },
    "Fløyen": {
      period: "Early Bergen development",
      years: "1070-1600",
      elements: ["city viewpoints", "defensive positions", "early Bergen settlements"]
    },
    "Ulriken": {
      period: "Stone Age to Iron Age",
      years: "6000 BCE - 500 CE",
      elements: ["ancient mountain passages", "early hunting practices", "stone age tools"]
    }
  };
  
  // Default historical elements if location not found
  const defaultHistory = {
    period: "Norwegian history",
    years: "800-1900",
    elements: ["Viking settlements", "traditional Norwegian life", "local historical events"]
  };
  
  return locationHistory[location] || defaultHistory;
}

/**
 * Helper function to get fantasy elements based on location
 * Placeholder implementation - would be replaced with actual location database
 * @param {String} location Location name
 * @returns {Array} Fantasy elements
 */
function getLocationFantasyElements(location) {
  // This would be replaced with a proper location database lookup
  const locationFantasy = {
    "Bergen": ["mountain trolls", "hidden city under Bryggen", "magical fjord creatures", "weather spirits"],
    "Bergen Forest Trail": ["enchanted forest", "talking animals", "forest guardians", "magical plants"],
    "Fløyen": ["cloud kingdom", "mountain dwellers", "magical viewpoints", "flying creatures"],
    "Ulriken": ["ancient stone giants", "mountain magic", "hidden caves with treasures", "sky portals"]
  };
  
  // Default fantasy elements if location not found
  const defaultFantasy = ["magical creatures", "enchanted landmarks", "hidden magical world", "mystical powers"];
  
  return locationFantasy[location] || defaultFantasy;
}

// Export the prompt creators for use in the application
export const storyPrompts = {
  createEducationalStoryPrompt,
  createHistoricalStoryPrompt,
  createFantasyStoryPrompt
};