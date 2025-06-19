import { Router } from "express";
import { getUser, login, signup, updateProfile, addProfileImage, deleteProfileImage, logOut } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: "upload/profiles/"});

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/userinfo",verifyToken, getUser)

authRoutes.post("/update-profile", verifyToken, updateProfile)

authRoutes.post("/add-profile-image", verifyToken,upload.single("profile-image"), addProfileImage)

authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage)

authRoutes.post("/logout", logOut)


export default authRoutes