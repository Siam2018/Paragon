import mongoose from "mongoose";

const noticeSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    PDFURL: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

export const Notice = mongoose.model("Notice", noticeSchema);
