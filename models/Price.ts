import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
    category:{
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    price: {
        type: Number,
        require: true
    },
    unitOfMea: {
        type: String,
        require: false
    }
}, {timestamps: true})

export default mongoose.models.Price || mongoose.model('Price', PriceSchema)