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
import { appConfig } from "./config/config.js";
// --- Routers ---
import { Router } from "express";
import birdsRouter from "./routes/birds.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import commentsRouter from "./routes/comments.js";
import birdVisualTraitsRouter from "./routes/birdVisualTraits.js";
// --- Initializers ---
import { initBirdVisualTraits } from "./routes/birdVisualTraits.js";
import { Services } from "./services/Services.js";

const API_DICT: Record<string, Router> = {
	[appConfig.paths.birds_path]: birdsRouter,
	[appConfig.paths.auth_path]: authRouter,
	[appConfig.paths.comments_path]: commentsRouter,
	[appConfig.paths.users_path]: usersRouter,
	[appConfig.paths.bird_visual_traits_path]: birdVisualTraitsRouter,
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
			origin: appConfig.reactAppUrl, // react
			credentials: true,
		})
	);
	app.use((req, res, next) => {
		req.services = new Services(em); // inyect services middleware
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
	Object.entries(API_DICT).forEach(([path, router]) => {
		app.use(path, router);
	});
	app.listen(appConfig.port, () => {
		console.log(`Listening at ${appConfig.apiBaseUrl}:${appConfig.port}`);
	});
}

function initializeDatabase(em: EntityManager) {
	initBirdVisualTraits(new Services(em).birdVisualTrait);
}

main();
