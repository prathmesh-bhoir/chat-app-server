import { Router } from "express";
import { getMessages } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const messsagesRoutes = Router();

messsagesRoutes.post("/get-messages", verifyToken, getMessages);

export default messsagesRoutes;