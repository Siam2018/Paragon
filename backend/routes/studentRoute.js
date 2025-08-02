import express from "express";
const router = express.Router();
import Auth from "../Middlewares/Auth.js";
import StudentController from "../Controllers/StudentController.js";
import AuthValidation from "../Middlewares/AuthValidation.js";
import FileUpload from "../Middlewares/FileUpload.js";

// Public routes
router.post("/Student/register", AuthValidation.studentRegisterValidation, StudentController.createStudent);
router.post("/Student/login", AuthValidation.studentSigninValidation, StudentController.loginStudent);

// Public view route for students (no authentication required)
router.get("/Student/public", StudentController.getAllStudents);

// Student authenticated routes
router.put("/Student/photo/:id", Auth, FileUpload('Students'), StudentController.updateStudentPhoto);
router.put("/Student/password/:id", Auth, StudentController.updateStudentPassword);

// Admin protected routes
router.get("/Admin/Student/", Auth, StudentController.getAllStudents);
router.get("/Admin/Student/:id", Auth, StudentController.getStudentById);
router.put("/Admin/Student/:id", Auth, StudentController.updateStudent);
router.put("/Admin/Student/password/:id", Auth, StudentController.updateStudentPassword);
router.delete("/Admin/Student/:id", Auth, StudentController.deleteStudent);

export default router;
