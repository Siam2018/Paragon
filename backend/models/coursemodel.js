import mongoose from "mongoose"
const courseSchema = mongoose.Schema({
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
    RegularClass: {
        type: Number,
        required: true,
    },
    ClassTest: {
        type: Number,
        required: true,
    },
    WeeklyReviewTest: {
        type: Number,
        required: true,
    },
    MonthlyTest: {
        type: Number,
        required: true,
    },
    ExclusiveTest: {
        type: Number,
        required: true,
    },
    ModelTest: {
        type: Number,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});


export const Course = mongoose.model("Course", courseSchema);