import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    unitOfMea: {
        type: String,
        required: false
    }
}, {timestamps: true})

export default mongoose.models.Price || mongoose.model('Price', PriceSchema)