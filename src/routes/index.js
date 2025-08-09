import { Router } from "express";
import { ensureAuth } from "../middlewares/authGuard.js";

const router = Router();

router.get("/", ensureAuth, (req, res) => {
  res.render("students/index", {
    title: "Dashboard - Students",
    students: [],
    query: {},
  });
});

export default router;
