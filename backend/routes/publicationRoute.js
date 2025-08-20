
import express from "express";
import { Publication } from "../../frontend/models/publicationmodel.js";
const router = express.Router();
import Auth from "../Middlewares/Auth.js";
import dynamicUpload from "../Middlewares/FileUpload.js";
import * as PublicationController from "../Controllers/PublicationController.js";

router.post("/Publication", Auth, dynamicUpload('Publications'), PublicationController.createPublication);

router.get("/Publication", PublicationController.getAllPublications);

router.get("/Publication/:id", Auth, PublicationController.getPublicationById);

router.put("/Publication/:id", Auth, dynamicUpload('Publications'), PublicationController.updatePublication);

router.delete("/Publication/:id", Auth, PublicationController.deletePublication);

export default router;