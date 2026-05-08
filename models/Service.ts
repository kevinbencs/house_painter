import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    heading: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true,
    },
    detail: {
        type: String,
        require: true
    },
    keywords: {
        type: [String],
        require: true
    },
    image: {
        type: String,
        require: true
    }
}, {timestamps: true})


export default mongoose.models.Service || mongoose.model("Service", ServiceSchema)