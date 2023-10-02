const mongoose = require('mongoose');
const { Schema } = mongoose;

const Messages = new Schema({
    text: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    sent: {
        type: Boolean,
        required: true,
    },
    seen: {
        type: Boolean,
        required: true,
    },
    relatedRoom: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Rooms',
    }
});

module.exports = mongoose.model('Messages', Messages);
