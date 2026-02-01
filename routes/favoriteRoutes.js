const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const requireAuth = require("../middleware/requireAuth");

// All routes require authentication
router.get("/favorites", requireAuth, favoriteController.showFavorites);
router.get("/favorites/search", requireAuth, favoriteController.searchVideos);
router.post("/favorites/add", requireAuth, favoriteController.addFavorite);
router.post("/favorites/delete/:id", requireAuth, favoriteController.deleteFavorite);
router.post("/favorites/reorder", requireAuth, favoriteController.reorderFavorites);

module.exports = router;
