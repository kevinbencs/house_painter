import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    blobUrl: {
        type: String,
        require: true
    },
    newUrl: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    order: {
        type: Number,
        require: true
    },
    show: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true})

export default mongoose.models.Image || mongoose.model('Image', ImageSchema)