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

export const Result = mongoose.model("Result", resultSchema);