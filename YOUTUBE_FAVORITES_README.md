# YouTube Favorites Feature

## Setup Instructions

### 1. Get a YouTube API Key

To use the YouTube search functionality, you need a YouTube Data API v3 key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to "Credentials" and create an API key
5. Copy your API key

### 2. Set the API Key as Environment Variable

You need to set the `YOUTUBE_API_KEY` environment variable before starting the server.

**Option 1: Set it in your terminal (macOS/Linux)**
```bash
export YOUTUBE_API_KEY="your_api_key_here"
npm run dev
```

**Option 2: Set it inline when running the server**
```bash
YOUTUBE_API_KEY="your_api_key_here" npm run dev
```

**Option 3: Create a .env file (recommended for development)**

1. Install dotenv:
```bash
npm install dotenv
```

2. Create a `.env` file in the project root:
```
YOUTUBE_API_KEY=your_api_key_here
```

3. Update `app.js` to load environment variables (add at the top):
```javascript
require('dotenv').config();
```

## Features

### YouTube Video Favorites
- **Search YouTube Videos**: Search for videos using the YouTube Data API
- **Add to Favorites**: Save videos to your personal favorites list
- **View Favorites**: See all your saved videos with thumbnails and channel info
- **Delete Favorites**: Remove videos from your favorites
- **Reorder Favorites** (Optional): Drag and drop to reorder your favorite videos
- **Watch Videos**: Click "Watch" to open videos on YouTube

### Database Schema

The `Favorites` table includes:
- `id`: Primary key
- `userId`: Foreign key to Users table
- `videoId`: YouTube video ID
- `title`: Video title
- `thumbnail`: Video thumbnail URL
- `channelTitle`: Channel name
- `displayOrder`: Order for custom sorting
- `createdAt`: Timestamp

### Routes

- `GET /favorites` - View favorites page (requires authentication)
- `GET /favorites/search?q=query` - Search YouTube videos (requires authentication)
- `POST /favorites/add` - Add video to favorites (requires authentication)
- `POST /favorites/delete/:id` - Delete favorite (requires authentication)
- `POST /favorites/reorder` - Update display order (requires authentication)

### Security

- All favorite routes are protected with the `requireAuth` middleware
- Users can only manage their own favorites
- The database uses foreign key constraints with CASCADE deletion

## Architecture

This feature follows the MVC pattern:

```
models/favorite.js           - Favorite data model
repositories/favoriteRepository.js  - Database operations
services/favoriteService.js  - Business logic & YouTube API
controllers/favoriteController.js   - Request handlers
routes/favoriteRoutes.js     - Route definitions
views/favorites.ejs          - UI with Bootstrap
```

## Technologies Used

- **Bootstrap 5.3**: Modern, responsive UI
- **YouTube Data API v3**: Video search functionality
- **Axios**: HTTP client for API requests
- **SQLite**: Database with foreign key constraints
- **Drag & Drop API**: For reordering favorites
