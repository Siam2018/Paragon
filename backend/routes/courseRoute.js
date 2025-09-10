import express from "express";
const router = express.Router();
import Auth from"../Middlewares/Auth.js";
import dynamicUpload from "../Middlewares/FileUpload.js";
import CourseController from "../Controllers/CourseController.js";

router.post("/Course", Auth, dynamicUpload('courses'), CourseController.createCourse);

router.get("/Course", CourseController.getAllCourses);

router.get("/Course/:id", Auth, CourseController.getCourseById);

router.put("/Course/:id", Auth, dynamicUpload('courses'), CourseController.updateCourse);

router.delete("/Course/:id", Auth, CourseController.deleteCourse);

export default router;