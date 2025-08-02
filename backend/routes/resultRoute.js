import express from "express";
const router = express.Router();

import Auth from "../Middlewares/Auth.js";
import upload from "../Middlewares/FileUpload.js";
import ResultController from "../Controllers/ResultController.js";

router.post("/Result", Auth, upload('Results'), ResultController.createResult);

router.get("/Result", ResultController.getAllResults);

router.get("/Result/:id", Auth, ResultController.getResultById);

router.put("/Result/:id", Auth, upload('Results'), ResultController.updateResult);

router.delete("/Result/:id", Auth, ResultController.deleteResult);

export default router;