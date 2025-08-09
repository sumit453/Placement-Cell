import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Employee from "../models/employee.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await Employee.findOne({ email: email.toLowerCase() });
        if (!user)
          return done(null, false, { message: "Invalid email or password" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
          return done(null, false, { message: "Invalid email or password" });
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Employee.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});
