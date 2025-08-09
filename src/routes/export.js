import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";
import { downloadCSV } from "../controllers/exportController.js";

const router = Router();

router.get("/csv", ensureAuth, downloadCSV);

export default router;
