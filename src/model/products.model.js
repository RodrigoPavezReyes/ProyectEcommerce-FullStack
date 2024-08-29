
import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"



const productsCollections= "products"

const productSchema = new mongoose.Schema({
    title : {type: String, require:true, max:50},
    description: {type: String, require:true, max:100},
    price: {type: Number,require:true},
    thumbnail: {type:String,require:true},
    code: {type: String,require:true},
    stock: {type: Number,require:true}
})

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollections, productSchema)

export default productModel


