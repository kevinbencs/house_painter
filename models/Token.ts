import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true,
        ref: "User",
    },
    usage:{
        type: Boolean,
        require: true
    }

},{timestamps: true})

export default mongoose.models.Token || mongoose.model('Token', TokenSchema)