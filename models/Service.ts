import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
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
    }
}, {timestamps: true})


export default mongoose.models.Service || mongoose.model("Service", ServiceSchema)