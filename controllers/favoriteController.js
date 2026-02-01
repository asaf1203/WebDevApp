const favoriteService = require("../services/favoriteService");

class FavoriteController {
    async showFavorites(req, res) {
        try {
            const userId = req.session.user.id;
            const favorites = await favoriteService.getUserFavorites(userId);
            
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                searchQuery: "",
                error: null,
                success: null,
            });
        } catch (err) {
            res.status(500).render("favorites", {
                user: req.session.user,
                favorites: [],
                searchResults: [],
                searchQuery: "",
                error: err.message,
                success: null,
            });
        }
    }

    async searchVideos(req, res) {
        try {
            const userId = req.session.user.id;
            const query = req.query.q || "";
            
            let searchResults = [];
            if (query.trim()) {
                searchResults = await favoriteService.searchYouTubeVideos(query);
            }
            
            const favorites = await favoriteService.getUserFavorites(userId);
            
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults,
                searchQuery: query,
                error: null,
                success: null,
            });
        } catch (err) {
            const favorites = await favoriteService.getUserFavorites(req.session.user.id);
            res.status(500).render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                searchQuery: req.query.q || "",
                error: err.message,
                success: null,
            });
        }
    }

    async addFavorite(req, res) {
        try {
            const userId = req.session.user.id;
            const { videoId, title, thumbnail, channelTitle } = req.body;
            
            await favoriteService.addFavorite(userId, {
                videoId,
                title,
                thumbnail,
                channelTitle,
            });
            
            res.redirect("/favorites?success=Video added to favorites!");
        } catch (err) {
            res.redirect(`/favorites?error=${encodeURIComponent(err.message)}`);
        }
    }

    async deleteFavorite(req, res) {
        try {
            const userId = req.session.user.id;
            const favoriteId = parseInt(req.params.id);
            
            await favoriteService.removeFavorite(favoriteId, userId);
            
            res.redirect("/favorites?success=Video removed from favorites!");
        } catch (err) {
            res.redirect(`/favorites?error=${encodeURIComponent(err.message)}`);
        }
    }

    async reorderFavorites(req, res) {
        try {
            const userId = req.session.user.id;
            const { orderedIds } = req.body;
            
            // orderedIds should be an array of numbers
            const ids = Array.isArray(orderedIds) 
                ? orderedIds.map(id => parseInt(id))
                : [];
            
            await favoriteService.reorderFavorites(userId, ids);
            
            res.json({ success: true, message: "Order updated successfully!" });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
}

module.exports = new FavoriteController();
