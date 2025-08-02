import express from "express";
const router = express.Router();
import AuthValidation from"../Middlewares/AuthValidation.js";
import  AuthController  from "../Controllers/AuthController.js";

router.post("/Admin/Register", AuthValidation.adminRegisterValidation, AuthController.adminRegister);
router.post("/Admin/Signin", AuthValidation.adminSigninValidation, AuthController.adminSignin);

export default router;
