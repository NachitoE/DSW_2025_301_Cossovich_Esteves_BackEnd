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
import birdSightingRouter from "./routes/birdSightings.js";
import filtersRouter from "./routes/filters.js"
// --- Initializers ---
import { Services } from "./services/Services.js";

const API_DICT: Record<string, Router> = {
  [appConfig.paths.birds_path]: birdsRouter,
  [appConfig.paths.auth_path]: authRouter,
  [appConfig.paths.comments_path]: commentsRouter,
  [appConfig.paths.users_path]: usersRouter,
  [appConfig.paths.bird_visual_traits_path]: birdVisualTraitsRouter,
  [appConfig.paths.bird_Sighting_path]: birdSightingRouter,
  [appConfig.paths.filters_path]: filtersRouter,
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
  //----- Assign Routers -----
  Object.entries(API_DICT).forEach(([path, router]) => {
    app.use(path, router);
  });

  //----- Error Handler for JWT -----
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'UnauthorizedError') {
      // Solo borrar la cookie si el token está EXPIRADO o es inválido
      // NO borrar si es un problema de permisos (403)
      if (err.code === 'credentials_required' || 
          err.message.includes('jwt expired') || 
          err.message.includes('invalid token')) {
        req.services.authService.logout()
      }
      return res.status(401).json({ 
        message: err.message || 'Token inválido o expirado',
        code: err.code 
      });
    }
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  });

  app.listen(appConfig.port, () => {
    console.log(`Listening at ${appConfig.apiBaseUrl}:${appConfig.port}`);
  });
}
main();
