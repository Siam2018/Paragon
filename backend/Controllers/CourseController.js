import { Course } from "../models/coursemodel.js";

const CourseController = {
    createCourse: async (request, response) => {
        try {
            console.log('Request body:', request.body);
            console.log('Request file:', request.file);
            
            if (!request.body.Title || !request.body.Description) {
                return response.status(400).send({
                    message: 'Title and Description are required.',
                });
            }
            
            const imageUrl = request.file ? request.file.filename : null;
            
            const newCourse = {
                Title: request.body.Title,
                Description: request.body.Description,
                ImageURL: imageUrl,
                RegularClass: parseInt(request.body.regularClass) || 0,
                ClassTest: parseInt(request.body.classTest) || 0,
                WeeklyReviewTest: parseInt(request.body.WeeklyReviewTest) || 0,
                MonthlyTest: parseInt(request.body.MonthlyTest) || 0,
                ExclusiveTest: parseInt(request.body.ExclusiveTest) || 0,
                ModelTest: parseInt(request.body.modelTest) || 0,
                Price: parseFloat(request.body.price) || 0
            };
            
            const course = await Course.create(newCourse);
            return response.status(201).send(course);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getAllCourses: async (request, response) => {
        try {
            const courses = await Course.find();
            return response.status(200).send(courses);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    getCourseById: async (request, response) => {
        try {
            const { id } = request.params;
            const course = await Course.findById(id);
            return response.status(200).json(course);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    updateCourse: async (request, response) => {
        try {
            console.log('Update request body:', request.body);
            console.log('Update request file:', request.file);
            
            if (!request.body.Title || !request.body.Description) {
                return response.status(400).send({
                    message: 'Title and Description are required.',
                });
            }
            
            const { id } = request.params;
            const updateData = {
                Title: request.body.Title,
                Description: request.body.Description,
                RegularClass: parseInt(request.body.regularClass) || 0,
                ClassTest: parseInt(request.body.classTest) || 0,
                WeeklyReviewTest: parseInt(request.body.WeeklyReviewTest) || 0,
                MonthlyTest: parseInt(request.body.MonthlyTest) || 0,
                ExclusiveTest: parseInt(request.body.ExclusiveTest) || 0,
                ModelTest: parseInt(request.body.modelTest) || 0,
                Price: parseFloat(request.body.price) || 0
            };
            
            if (request.file) {
                updateData.ImageURL = request.file.filename;
            }
            
            const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedCourse) {
                return response.status(404).send({ message: 'Course not found.' });
            }
            return response.status(200).send(updatedCourse);
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    },

    deleteCourse: async (request, response) => {
        try {
            const { id } = request.params;
            const deletedCourse = await Course.findByIdAndDelete(id);
            if (!deletedCourse) {
                return response.status(404).send({ message: 'Course not found.' });
            }
            return response.status(200).json({
                message: 'Course deleted successfully.',
                course: deletedCourse
            });
        }
        catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
        }
    }
};

export default CourseController;