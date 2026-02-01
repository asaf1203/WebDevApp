const favoriteRepo = require("../repositories/favoriteRepository");
const axios = require("axios");

class FavoriteService {
    async searchYouTubeVideos(query) {
        // Using YouTube Data API v3
        // Note: You'll need to get a YouTube API key from Google Cloud Console
        // For now, we'll use a placeholder. Users should set YOUTUBE_API_KEY in environment
        const apiKey = process.env.YOUTUBE_API_KEY || "";
        
        if (!apiKey) {
            throw new Error("YouTube API key not configured. Please set YOUTUBE_API_KEY environment variable.");
        }

        try {
            const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 10,
                    key: apiKey,
                },
            });

            return response.data.items.map(item => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                channelTitle: item.snippet.channelTitle,
            }));
        } catch (error) {
            console.error("YouTube API Error:", error.response?.data || error.message);
            throw new Error("Failed to search YouTube videos. Please check your API key.");
        }
    }

    async getUserFavorites(userId) {
        return await favoriteRepo.findByUserId(userId);
    }

    async addFavorite(userId, { videoId, title, thumbnail, channelTitle }) {
        // Check if already exists
        const existing = await favoriteRepo.findByUserAndVideo(userId, videoId);
        if (existing) {
            throw new Error("Video already in favorites.");
        }

        // Get current max displayOrder
        const userFavorites = await favoriteRepo.findByUserId(userId);
        const maxOrder = userFavorites.length > 0 
            ? Math.max(...userFavorites.map(f => f.displayOrder)) 
            : -1;

        return await favoriteRepo.create({
            userId,
            videoId,
            title,
            thumbnail,
            channelTitle,
            displayOrder: maxOrder + 1,
        });
    }

    async removeFavorite(favoriteId, userId) {
        const favorite = await favoriteRepo.findById(favoriteId);
        if (!favorite) {
            throw new Error("Favorite not found.");
        }
        
        if (favorite.userId !== userId) {
            throw new Error("Unauthorized to delete this favorite.");
        }

        return await favoriteRepo.delete(favoriteId);
    }

    async reorderFavorites(userId, orderedIds) {
        // orderedIds is an array of favorite IDs in the new order
        const favorites = await favoriteRepo.findByUserId(userId);
        const userFavoriteIds = new Set(favorites.map(f => f.id));

        // Verify all IDs belong to user
        for (const id of orderedIds) {
            if (!userFavoriteIds.has(id)) {
                throw new Error("Invalid favorite ID in reorder request.");
            }
        }

        // Update display order
        const promises = orderedIds.map((id, index) => 
            favoriteRepo.updateOrder(id, index)
        );

        await Promise.all(promises);
        return true;
    }
}

module.exports = new FavoriteService();
