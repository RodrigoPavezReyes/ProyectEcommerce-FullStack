import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    first_name : String,
    last_name: String,
    email:String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
})


const User = mongoose.model("User", userShema)

export default User