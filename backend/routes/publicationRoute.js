
import express from "express";
import { Publication } from "../models/publicationmodel.js";
const router = express.Router();
import Auth from "../Middlewares/Auth.js";
import upload from "../Middlewares/FileUpload.js";
import * as PublicationController from "../Controllers/PublicationController.js";

router.post("/Publication", Auth, upload('Publications'), PublicationController.createPublication);

router.get("/Publication", PublicationController.getAllPublications);

router.get("/Publication/:id", Auth, PublicationController.getPublicationById);

router.put("/Publication/:id", Auth, upload('Publications'), PublicationController.updatePublication);

router.delete("/Publication/:id", Auth, PublicationController.deletePublication);

export default router;