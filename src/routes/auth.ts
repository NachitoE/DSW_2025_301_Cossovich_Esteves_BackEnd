import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
import session from "express-session";

config();

const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      //TODO: find or create user in db
      console.log("Google profile:", profile);
      cb(null, profile);
    }
  )
);

// serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user); // -> just user id ideally
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

// Rutas de auth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  function (req, res) {
    res.redirect("http://localhost:5173/"); // redirige al frontend
  }
);

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ msg: "No autenticado" });
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ msg: "Logout exitoso" });
  });
});

export default router;
