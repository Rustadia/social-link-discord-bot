const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Create a new Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Validate required environment variables
if (!process.env.DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.PROJECT_ID) {
  console.error('Error: PROJECT_ID is required in .env file');
  process.exit(1);
}

if (!process.env.API_KEY) {
  console.error('Error: API_KEY is required in .env file');
  process.exit(1);
}

// Default website URL if not provided in environment
const WEBSITE_URL = process.env.WEBSITE_URL || 'link.rustadia.com';

// API configuration from environment variables
const API_BASE_URL = 'https://api.social-link.net/v1';
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;
const API_URL = `${API_BASE_URL}/${PROJECT_ID}/players`;

// Function to fetch player count
async function fetchPlayerCount() {
  try {
    // Using bearer token for authorization from environment variable
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    // Get the total players from the meta.total field which represents the total count across all pages
    const totalPlayers = response.data.meta.total;
    console.log(`Retrieved total player count: ${totalPlayers}`);
    return totalPlayers;
  } catch (error) {
    console.error('Error fetching player count:', error);
    return 0; // Return 0 if there's an error
  }
}

// Global variable to store the latest player count
let currentPlayerCount = 0;

// Function to periodically fetch player count (every 180 seconds)
function startPlayerCountFetcher() {
  // Fetch immediately on startup
  fetchPlayerCount().then(count => {
    currentPlayerCount = count;
    console.log(`Initial player count: ${currentPlayerCount}`);
  });
  
  // Then fetch every 180 seconds
  setInterval(async () => {
    try {
      currentPlayerCount = await fetchPlayerCount();
      console.log(`Updated player count: ${currentPlayerCount}`);
    } catch (error) {
      console.error('Error in player count fetcher:', error);
    }
  }, 180000); // Update every 180 seconds (3 minutes)
}

// Function to update bot status (every 10 seconds)
function startStatusUpdater() {
  let shouldShowPlayerCount = true;
  
  setInterval(() => {
    try {
      if (shouldShowPlayerCount) {
        // Use the stored player count
        client.user.setActivity({
          name: `${currentPlayerCount} players`,
          type: ActivityType.Watching
        });
      } else {
        // Set website link activity using environment variable
        client.user.setActivity({
          name: WEBSITE_URL,
          type: ActivityType.Watching
        });
      }
      
      // Toggle for next time
      shouldShowPlayerCount = !shouldShowPlayerCount;
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, 10000); // Update status every 10 seconds
}

// When the client is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Start the player count fetcher (runs every 180 seconds)
  startPlayerCountFetcher();
  
  // Start the status updater (runs every 10 seconds)
  startStatusUpdater();
});

// Login with token
client.login(process.env.DISCORD_TOKEN);