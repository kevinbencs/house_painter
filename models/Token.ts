import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        ref: "User",
    },
    usage:{
        type: Boolean,
        required: true
    }

},{timestamps: true})

export default mongoose.models.Token || mongoose.model('Token', TokenSchema)