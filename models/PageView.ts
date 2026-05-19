import mongoose from "mongoose";

const PageViewSchema = new mongoose.Schema({
    pathname: {
        type: String,
        required: true,
        index: true 
    },
    referrer: {
        type: String,
        default: null     
    }
}, { timestamps: true })

export default mongoose.models.PageView || mongoose.model("PageView", PageViewSchema)