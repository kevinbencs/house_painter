import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {timestamps: true})


export default mongoose.models.Place || mongoose.model("Place", PlaceSchema)