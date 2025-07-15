import express from "express";
import { getGroups } from "../controllers/groupsController.js";

const groupsRouter = express.Router();

groupsRouter.get("/groups", getGroups);

export default groupsRouter;