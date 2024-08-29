
import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, default: 1 }
    }]
});

const cartModel  = mongoose.model(cartsCollection, cartSchema);

export default cartModel;

