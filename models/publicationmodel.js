import mongoose from "mongoose"
const PublicationSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    ImageURL: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }

);

const Publication = mongoose.model("Publication", PublicationSchema);
export default Publication;