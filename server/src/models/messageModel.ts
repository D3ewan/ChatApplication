import mongoose, { mongo } from "mongoose"

const messageModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }
}, { timestamps: true })


export default mongoose.model('message', messageModel);