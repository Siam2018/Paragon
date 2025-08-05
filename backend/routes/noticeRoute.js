import express from "express";
const router = express.Router();
import Auth from"../Middlewares/Auth.js";
import dynamicUpload from "../Middlewares/FileUpload.js";
import NoticeController from "../Controllers/NoticeController.js";

router.post("/Notice", Auth, dynamicUpload('notices'), NoticeController.createNotice);

router.get("/Notice", NoticeController.getAllNotices);

router.get("/Notice/:id", Auth, NoticeController.getNoticeById);

router.put("/Notice/:id", Auth, dynamicUpload('notices'), NoticeController.updateNotice);

router.delete("/Notice/:id", Auth, NoticeController.deleteNotice);

export default router;
