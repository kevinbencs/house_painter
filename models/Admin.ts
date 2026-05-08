import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    twofa: {
        type: String
    }
}, {timestamps: true})

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);