const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    filename: { type: String },
    path: { type: String },
    originalname: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    user: { type: String},
    created_at: { type: Date, default: Date.now() }
});

module.exports = model('video', videoSchema);