import bcrypt from "bcryptjs";
import passport from "passport";
import Employee from "../models/employee.js";

export async function getSignup(req, res) {
  if (req.user) return res.redirect("/");
  res.render("auth/signup", { title: "Sign Up" });
}

export async function postSignup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/auth/signup");
    }
    const exists = await Employee.findOne({ email: email.toLowerCase() });
    if (exists) {
      req.flash("error", "Email already in use");
      return res.redirect("/auth/signup");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await Employee.create({ name, email: email.toLowerCase(), passwordHash });
    req.flash("success", "Account created. Please sign in.");
    res.redirect("/auth/signin");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to sign up");
    res.redirect("/auth/signup");
  }
}

export async function getSignin(req, res) {
  if (req.user) return res.redirect("/");
  res.render("auth/signin", { title: "Sign In" });
}

export function postSignin(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/signin",
    failureFlash: true,
  })(req, res, next);
}

export function postLogout(req, res) {
  req.logout(() => {
    req.flash("success", "Logged out");
    res.redirect("/auth/signin");
  });
}
