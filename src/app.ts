import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import {
	EntityManager,
	MikroORM,
	MongoEntityManager,
} from "@mikro-orm/mongodb";
import mikroOrmConfig from "./mikro-orm.config.js";
// --- Routers ---
import { Router } from "express";
import birdsRouter from "./routes/birds.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import commentsRouter from "./routes/comments.js";
import birdVisualTraitsRouter from "./routes/birdVisualTraits.js";
// --- Initializers ---
import { initBirdVisualTraits } from "./routes/birdVisualTraits.js";
// --- Paths ---
const APP_PATH: string = "/";
const BIRDS_PATH: string = "/api/birds/";
const AUTH_PATH: string = "/api/auth/";
const COMMENTS_PATH: string = "/api/comments/";
const USERS_PATH: string = "/api/users/";
const BIRD_VISUAL_TRAITS_PATH: string = "/api/bird-visual-traits/";

const API_DICT: Record<string, Router> = {
	BIRDS_PATH: birdsRouter,
	AUTH_PATH: authRouter,
	COMMENTS_PATH: commentsRouter,
	USERS_PATH: usersRouter,
	BIRD_VISUAL_TRAITS_PATH: birdVisualTraitsRouter,
};

//----- Initialize app -----
async function main() {
	const orm = await MikroORM.init(mikroOrmConfig);
	console.log("MikroORM inicializado");
	const em = orm.em.fork() as MongoEntityManager; // get entity manager
	//----- Express -----
	const app = express();
	app.use(
		cors({
			origin: "http://localhost:5173", // react
			credentials: true,
		})
	);
	app.use((req, res, next) => {
		req.em = em.fork(); // fork a new EntityManager for each request
		next();
	});
	app.use(express.json());
	app.use(
		session({
			secret: process.env.SESSION_SECRET!,
			resave: false,
			saveUninitialized: false,
		})
	);
	//----- Passport -----
	app.use(passport.initialize());
	app.use(passport.session());
	//----- Initialize DB -----
	initializeDatabase(em);
	//----- Assign Routers -----
	for (const [path, router] of Object.entries(API_DICT)) {
		app.use(path, router);
	}
	app.listen(3000, () => {
		console.log("Listening at http://localhost:3000/");
	});
}

function initializeDatabase(em: EntityManager) {
	initBirdVisualTraits(em);
}

main();
