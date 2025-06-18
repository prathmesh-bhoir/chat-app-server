import { Router } from "express";
import { getUser, login, signup } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/userinfo",verifyToken, getUser)

export default authRoutes