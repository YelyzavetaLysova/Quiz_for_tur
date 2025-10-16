/**
 * Story Generator Utility for Trail Tale App
 * 
 * This file provides functions to generate stories using Cohere's API.
 * It handles API calls, error handling, and result formatting.
 * 
 * NOTE: This is a demo implementation. In production:
 * 1. API keys should be stored in environment variables or a secure vault
 * 2. Server-side implementation is strongly recommended for API key security
 * 3. Implement proper rate limiting, caching, and error handling
 */

import { storyPrompts } from './storyPrompts.js';
import { v4 as uuidv4 } from 'uuid'; // Would need to be added as dependency

// Configuration for the story generator
const generatorConfig = {
  // IMPORTANT: This is only for demo purposes. 
  // In production, NEVER store API keys in client-side code.
  // Use environment variables on a server instead.
  apiKey: "YOUR_COHERE_API_KEY", // Replace with actual key from environment variables
  apiEndpoint: "https://api.cohere.ai/v1/generate",
  defaultTimeout: 30000 // 30 seconds
};

/**
 * Generates a story based on the provided parameters
 * 
 * @param {Object} params Parameters for story generation
 * @param {string} params.genre "educational" | "historical" | "fantasy"
 * @param {string} params.location Location name
 * @param {Object} params.weather Weather conditions
 * @param {Object} params.familyProfile Family information
 * @param {number[]} params.ageRange Min and max age range [min, max]
 * @param {string} [params.storyLength="medium"] "short" | "medium" | "long"
 * @returns {Promise<Object>} Generated story object
 */
export async function generateStory(params) {
  try {
    const { genre } = params;
    let promptConfig;
    
    // Select prompt template based on genre
    switch(genre.toLowerCase()) {
      case 'educational':
        promptConfig = storyPrompts.createEducationalStoryPrompt(params);
        break;
      case 'historical':
        promptConfig = storyPrompts.createHistoricalStoryPrompt(params);
        break;
      case 'fantasy':
        promptConfig = storyPrompts.createFantasyStoryPrompt(params);
        break;
      default:
        throw new Error(`Unknown genre: ${genre}`);
    }
    
    // Make API call to Cohere
    const response = await callCohereAPI(promptConfig);
    
    // Process and format the response
    return formatStoryResponse(response, params);
    
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

/**
 * Makes the actual API call to Cohere
 * 
 * @param {Object} promptConfig Prompt configuration
 * @returns {Promise<Object>} Raw API response
 */
async function callCohereAPI(promptConfig) {
  try {
    const response = await fetch(generatorConfig.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${generatorConfig.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: promptConfig.model,
        prompt: promptConfig.prompt,
        max_tokens: promptConfig.maxTokens,
        temperature: promptConfig.temperature,
        p: promptConfig.topP,
        k: promptConfig.topK,
        stop_sequences: promptConfig.stopSequences,
        system: promptConfig.systemPrompt
      }),
      timeout: generatorConfig.defaultTimeout
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cohere API error: ${response.status} ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    throw error;
  }
}

/**
 * Formats the raw API response into our story schema
 * 
 * @param {Object} response Raw API response
 * @param {Object} params Original parameters
 * @returns {Object} Formatted story object
 */
function formatStoryResponse(response, params) {
  try {
    // Parse the generated story from the text response
    // Note: This assumes the API returns valid JSON as requested in the prompt
    const generatedContent = JSON.parse(response.generations[0].text);
    
    // Create prompt hash for reproducibility
    const promptHash = createSimpleHash(JSON.stringify(params));
    
    // Return formatted story object
    return {
      id: `story-${uuidv4()}`,
      ...generatedContent,
      genre: params.genre,
      ageRange: params.ageRange,
      location: params.location,
      weather: params.weather,
      promptHash: promptHash,
      safety: {
        flagged: false, // Would use actual moderation check in production
        reviewed: false
      },
      createdAt: new Date().toISOString(),
      saved: false,
      setting: {
        region: params.location,
        terrain: determineTerrainType(params.location),
        difficulty: "moderate", // Default, would be location-specific
        landmarks: [] // Would populate from location database
      }
    };
    
  } catch (error) {
    console.error("Error formatting story response:", error);
    throw new Error(`Failed to parse story response: ${error.message}`);
  }
}

/**
 * Creates a simple hash for reproducibility
 * Not cryptographically secure, just for tracking
 * 
 * @param {string} str String to hash
 * @returns {string} Simple hash
 */
function createSimpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Determines terrain type based on location name
 * Placeholder implementation - would be replaced with location database
 * 
 * @param {string} location Location name
 * @returns {string} Terrain type
 */
function determineTerrainType(location) {
  const location_lower = location.toLowerCase();
  
  if (location_lower.includes('forest') || location_lower.includes('skog')) {
    return 'forest';
  } else if (location_lower.includes('mountain') || location_lower.includes('fjell')) {
    return 'mountain';
  } else if (location_lower.includes('coast') || location_lower.includes('kyst')) {
    return 'coastal';
  } else {
    return 'mixed';
  }
}

// For demonstration, add example stories that would be generated
// In a real implementation, these would come from the API
import { exampleStories } from './exampleStories.js';