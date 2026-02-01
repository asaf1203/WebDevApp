const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM Favorites WHERE userId = ? ORDER BY displayOrder ASC, createdAt DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows ? rows.map(row => new Favorite(row)) : []);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Favorites WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row ? new Favorite(row) : null);
            });
        });
    }

    async findByUserAndVideo(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM Favorites WHERE userId = ? AND videoId = ?`,
                [userId, videoId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? new Favorite(row) : null);
                }
            );
        });
    }

    async create({ userId, videoId, title, thumbnail, channelTitle, displayOrder }) {
        const createdAt = new Date().toISOString();

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Favorites (userId, videoId, title, thumbnail, channelTitle, displayOrder, createdAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, videoId, title, thumbnail, channelTitle, displayOrder || 0, createdAt],
                function (err) {
                    if (err) return reject(err);
                    resolve(
                        new Favorite({
                            id: this.lastID,
                            userId,
                            videoId,
                            title,
                            thumbnail,
                            channelTitle,
                            displayOrder: displayOrder || 0,
                            createdAt,
                        })
                    );
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Favorites WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    async updateOrder(id, displayOrder) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE Favorites SET displayOrder = ? WHERE id = ?`,
                [displayOrder, id],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }
}

module.exports = new FavoriteRepository();
