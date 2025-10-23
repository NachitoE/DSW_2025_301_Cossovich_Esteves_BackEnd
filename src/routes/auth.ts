import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { appConfig } from "../config/config.js";
import dotenv from "dotenv";
import { User } from "../entities/User.js";

dotenv.config();
const router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: appConfig.apiFullUrl + "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (req, _accessToken, _refreshToken, profile, cb) {
      try {
        //--- load or create user in database ---
        const userService = req.services.user;
        let user = await userService.findByGoogleId(profile.id);

        if (!user) {
          user = await userService.create({
            googleId: profile.id,
            name: profile.displayName,
            username: userService.makeUserName(profile.displayName, profile.id),
            avatarURL: profile.photos?.[0]?.value || "",
            role: "user",
          });
          console.log("Usuario creado:", user);
        } else {
          // refresh image if changed
          if (user.avatarURL !== profile.photos?.[0]?.value) {
            user.avatarURL = profile.photos?.[0]?.value || "";
            await userService.update(user);
          }
        }
        cb(null, user);
      } catch (error) {
        console.error("Error in Google authentication:", error);
        cb(error);
      }
    }
  )
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  function (req, res) {
    const user = req.user as User;
    console.log("Authenticated user:", user);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    // Successful authentication, redirect home
    req.services.auth.generateAndSetTokenCookie(res, user);
    res.redirect(appConfig.reactAppUrl);
  }
);

router.get("/me", async (req, res) => {
  if (req.auth) {
    const user = await req.services.user.findById(req.auth.id)
    if(!user) res.status(401).json({ message: "Token inválido" });
    res.json({ data: user });
  } else {
    res.status(401).json({ message: "No autenticado" });
  }
});

router.get("/logout", (req, res) => {
  if (req.auth) {
    req.services.auth.removeTokenCookie(res);
    res.json({ message: "token removido" });
  } else {
    res.status(401).json({ message: "No autenticado" });
  }
})
router.get("/isAdmin", (req, res) => {
  if (req.auth) {
    res.json({ isAdmin: req.auth.role === "admin" });
  } else {
    res.status(401).json({ message: "No autenticado" });
  }
});

export default router;
