import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";
import {
  index,
  getNew,
  create,
  getEdit,
  update,
  destroy,
} from "../controllers/studentController.js";

const router = Router();

router.get("/", ensureAuth, index);
router.get("/new", ensureAuth, getNew);
router.post("/", ensureAuth, create);
router.get("/:id/edit", ensureAuth, getEdit);
router.post("/:id", ensureAuth, update);
router.post("/:id/delete", ensureAuth, destroy);

export default router;
