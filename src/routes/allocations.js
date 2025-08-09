import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";
import {
  allocate,
  updateResult,
  remove,
} from "../controllers/allocationController.js";

const router = Router();

router.post("/interview/:interviewId/allocate", ensureAuth, allocate);
router.post("/:id/result", ensureAuth, updateResult);
router.post("/:id/delete", ensureAuth, remove);

export default router;
