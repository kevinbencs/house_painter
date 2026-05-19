import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    blobUrl: {
        type: String,
        required: true
    },
    newUrl: {
        type: String,
        required: true,
        unique: true,
    },
    detail: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true})

export default mongoose.models.Image || mongoose.model('Image', ImageSchema)