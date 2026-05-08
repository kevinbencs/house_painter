import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    name: {
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
        type: Array,
        require: true
    },
    image: {
        type: String,
        require: true
    }
}, {timestamps: true})


export default mongoose.models.Place || mongoose.model("Place", PlaceSchema)