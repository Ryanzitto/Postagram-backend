import { Router } from "express";
import upload from "../../config/multer.js";

import { uploadSingle } from "../controllers/upload.controller.js";

const router = Router();

router.post("/upload-single", upload.single("file"), uploadSingle);

export default router;
