import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
import session from "express-session";
import { User } from "../entities/User.js";

config();

const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {
        //--- load or create user in database ---
        console.log("req.em existe?", !!req.em);
        let user = await req.em.findOne(User, { googleId: profile.id });

        if (!user) {
          user = req.em.create(User, {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            username:
              profile.displayName.replace(/\s+/g, "").toLowerCase() +
              profile.id.slice(0, 5),
            avatarURL: profile.photos?.[0]?.value || "",
            role: "user",
          });
          await req.em.persistAndFlush(user);
          console.log("Usuario creado:", user);
        }

        console.log("Google profile:", profile);
        cb(null, user);
      } catch (error) {
        console.error("Error in Google authentication:", error);
        cb(error);
      }
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
