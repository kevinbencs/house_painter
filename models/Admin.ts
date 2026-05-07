import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
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
    },
    twofa: {
        type: String
    }
}, {timestamps: true})

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);