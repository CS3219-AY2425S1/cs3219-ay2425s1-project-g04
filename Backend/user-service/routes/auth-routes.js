import express from "express";

import { handleLogin, handleVerifyAdmin, handleVerifyToken } from "../controller/auth-controller.js";
import { verifyAccessToken, verifyIsAdmin } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

// add new route to check for admin
router.get("/verify-admin", verifyAccessToken, verifyIsAdmin, handleVerifyAdmin);

export default router;
