import mongoose from "mongoose"
const resultSchema = mongoose.Schema({
    ImageURL: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }

);

const Result = mongoose.model("Result", resultSchema);
export default Result;