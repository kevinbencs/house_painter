import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        unique: true
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
    },
    visibility: {
        type: Boolean,
        required: true,
        default: false
    },
    headingParahg: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })


export default mongoose.models.Place || mongoose.model("Place", PlaceSchema)