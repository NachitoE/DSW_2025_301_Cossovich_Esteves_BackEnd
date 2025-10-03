import express from "express";
import cors from "cors";
import passport from "passport";
import {
  EntityManager,
  MikroORM,
  MongoEntityManager,
} from "@mikro-orm/mongodb";
import mikroOrmConfig from "./mikro-orm.config.js";
import { appConfig } from "./config/config.js";
import { expressjwt } from "express-jwt";
import cookieParser from "cookie-parser";
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
  app.use(express.json());
  app.use(cookieParser());
  //----- JWT -----
  app.use(
    expressjwt({
      secret: process.env.JWT_SECRET!,
      algorithms: ["HS256"],
      credentialsRequired: false,
      getToken: function fromHeaderOrQuerystring(req) {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
          return req.query.token as string;
        } else if (req.cookies && req.cookies.access_token) {
          return req.cookies.access_token;
        }
        return undefined;
      },
    })
  );
  app.use((req, res, next) => {
    req.services = new Services(em); // inyect services middleware
    next();
  });
  //----- Passport -----
  app.use(passport.initialize());
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
