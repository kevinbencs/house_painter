import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: "Name is require",
        max: 25,
    },
    password: {
        type: String,
        required: "Your password is required",
    },
    email: {
        type: String,
        require: "Email is require",
        unique: true,
        lowercase: true,
        trim: true,
    }
}, {timestamps: true})

export default mongoose.models.User || mongoose.model('User', UserSchema);