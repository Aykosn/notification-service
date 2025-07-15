import express from "express";
import multer from "multer";
import { notify } from "../controllers/notificationController.js";

const notificationRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

notificationRouter.post("/notify", upload.any(), notify);

export default notificationRouter;