import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    foodname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type:String,
        required :true
    }
});

const Food = mongoose.model("secondfoods", foodSchema);

export default Food;