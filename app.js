import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import passport from "passport";
import expressLayouts from "express-ejs-layouts";
import csrf from "csurf";
import MongoStore from "connect-mongo";

import { connectDB } from "./src/config/db.js";
import "./src/config/passport.js";

import indexRoutes from "./src/routes/index.js";
import authRoutes from "./src/routes/auth.js";
import studentRoutes from "./src/routes/students.js";
import interviewRoutes from "./src/routes/interviews.js";
import allocationRoutes from "./src/routes/allocations.js";
import exportRoutes from "./src/routes/export.js";
import jobsRoutes from "./src/routes/jobs.js";

dotenv.config();

const app = express();

// Behind a proxy in production (e.g., Render, Heroku)
app.set("trust proxy", 1);

// Security and logging
app.use(helmet());
app.use(morgan("dev"));

// View engine (EJS + layouts)
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // default layout: src/views/layout.ejs

// Static files
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Body parsing + method override
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Session store in MongoDB (fixes MemoryStore warning)
const mongoUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/placement_cell";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // requires HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: MongoStore.create({
      mongoUrl,
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: "native",
    }),
  })
);

// Flash messages + Passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection
app.use(csrf());

// Globals for views
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.csrfToken = req.csrfToken();
  res.locals.flashSuccess = req.flash("success");
  res.locals.flashError = req.flash("error");
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/interviews", interviewRoutes);
app.use("/allocations", allocationRoutes);
app.use("/export", exportRoutes);
app.use("/jobs", jobsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

// Server start
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
