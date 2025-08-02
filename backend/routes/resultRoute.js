import express from "express";
const router = express.Router();

import Auth from "../Middlewares/Auth.js";
import dynamicUpload from "../Middlewares/FileUpload.js";
import ResultController from "../Controllers/ResultController.js";

router.post("/Result", Auth, dynamicUpload('Results'), ResultController.createResult);

router.get("/Result", ResultController.getAllResults);

router.get("/Result/:id", Auth, ResultController.getResultById);

router.put("/Result/:id", Auth, dynamicUpload('Results'), ResultController.updateResult);

router.delete("/Result/:id", Auth, ResultController.deleteResult);

export default router;