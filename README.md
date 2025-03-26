# Social-Link.net Discord Count Bot

A simple Discord bot that displays the total player count from Social-Link.net API. The bot updates its status every 10 seconds, alternating between showing the current player count and your website URL, while minimizing API calls.

## Features

- Fetches player count from Social-Link.net API every 3 minutes
- Updates Discord bot status message every 10 seconds
- Alternates between showing player count and website URL
- Fully configurable via environment variables
- Optimized to minimize API requests

## Requirements

- Node.js (v16.9.0 or higher)
- npm (Node Package Manager)
- A Discord bot token
- Social-Link.net API credentials (Project ID and API Key)

## Installation

1. Clone this repository or download the code
   ```
   git clone https://github.com/Rustadia/social-link-discord-bot.git
   cd social-link-discord-bot
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your configuration
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   PROJECT_ID=your_social_link_project_id
   API_KEY=your_social_link_api_key
   WEBSITE_URL=your_link_website_here
   ```

4. Start the bot
   ```
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Your Discord bot token |
| `PROJECT_ID` | Yes | Your Social-Link.net project ID |
| `API_KEY` | Yes | Your Social-Link.net API key |
| `WEBSITE_URL` | No | The website URL to display in the bot's status |

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the "Bot" tab and click "Add Bot"
4. Copy your bot token and add it to the `.env` file
5. Enable the "SERVER MEMBERS INTENT" under Privileged Gateway Intents
6. Use the OAuth2 URL Generator in the "OAuth2" tab to generate an invite link with the "bot" scope and "Administrator" permission
7. Invite the bot to your server using the generated link

### Social-Link.net Configuration

1. Obtain your Project ID and API Key from Social-Link.net
2. Add these values to the `.env` file

## Files

- `index.js` - Main bot code
- `.env` - Configuration file for environment variables
- `package.json` - Dependencies and project metadata

## Example Status Updates

The bot will update its status with:
- "Watching X players" (where X is the current player count)
- "Watching link.rustadia.com" (or your custom website URL)

## Customization

To modify the bot's behavior:

### Update Frequencies

The bot uses two separate update intervals:
- **API Calls**: Every 180 seconds (3 minutes) - To minimize API usage
- **Status Updates**: Every 10 seconds - For a dynamic presence

To change these intervals:

1. Open `index.js`
2. For API call frequency, modify:
   ```javascript
   }, 180000); // Update every 180 seconds (3 minutes)
   ```
3. For status update frequency, modify:
   ```javascript
   }, 10000); // Update status every 10 seconds
   ```

### Website URL

You can change the displayed website URL in two ways:
1. Set the `WEBSITE_URL` environment variable in your `.env` file
2. If not specified, it defaults to "link.rustadia.com"

## Error Handling

The bot includes robust error handling:
- Logs detailed error information to the console
- Validates all required environment variables at startup
- Maintains the last successfully retrieved player count during API failures
- If it cannot fetch the count on initial startup, displays "0 players" until successful
- Automatically continues trying to update on the next scheduled interval

## Performance Considerations

This bot is designed to be API-efficient:

- Makes API requests only once every 3 minutes instead of on every status change
- Caches the player count between API calls
- Updates the bot's status more frequently for a dynamic presence without additional API load
- Handles API errors gracefully by maintaining the last known player count

## License

MIT License