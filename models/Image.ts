import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    blobUrl: {
        type: String,
        require: true
    },
    newUrl: {
        type: String,
        require: true
    }
}, {timestamps: true})

export default mongoose.models.Image || mongoose.model('Image', ImageSchema)