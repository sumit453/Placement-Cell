import { Router } from "express";
import {
  getSignup,
  postSignup,
  getSignin,
  postSignin,
  postLogout,
} from "../controllers/authController.js";

const router = Router();

router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/signin", getSignin);
router.post("/signin", postSignin);
router.post("/logout", postLogout);

export default router;
