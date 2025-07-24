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
			passReqToCallback: true,
		},
		function (req, accessToken, refreshToken, profile, cb) {
			// save/load user on db | session
			return cb(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj, done) => {
	done(null, obj!);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/err" }),
	function (req, res) {
		// Successful authentication, redirect home.
		console.log("User authenticated:", req.user);
		res.redirect("http://localhost:5173");
	}
);

router.get("/err", (req, res) => {
	res.status(401).json({ message: "Authentication failed" });
});
export default router;
