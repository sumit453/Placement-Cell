import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";
import {
  index,
  getNew,
  create,
  show,
} from "../controllers/interviewController.js";

const router = Router();

router.get("/", ensureAuth, index);
router.get("/new", ensureAuth, getNew);
router.post("/", ensureAuth, create);
router.get("/:id", ensureAuth, show);

export default router;
