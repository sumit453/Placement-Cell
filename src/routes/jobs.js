import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";
import { listJobs } from "../controllers/jobsController.js";

const router = Router();

router.get("/", ensureAuth, listJobs);

export default router;
