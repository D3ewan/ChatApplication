const mongoose = require('mongoose');
const { Schema } = mongoose;

const Rooms = new Schema({
    creators: {
        type: Array,
        required: true,
    },
    messages: {
        type: Array,
        required: true,
        ref: 'Messages',
    },
    lastMessage : {
        type: Object,
    },
});

module.exports = mongoose.model('Rooms', Rooms);
