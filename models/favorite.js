class Favorite {
    constructor({ id, userId, videoId, title, thumbnail, channelTitle, displayOrder, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.videoId = videoId;
        this.title = title;
        this.thumbnail = thumbnail;
        this.channelTitle = channelTitle;
        this.displayOrder = displayOrder || 0;
        this.createdAt = createdAt;
    }
}

module.exports = Favorite;
