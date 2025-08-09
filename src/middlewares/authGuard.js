export function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash("error", "Please sign in to continue");
  res.redirect("/auth/signin");
}
