import express from "express";
import cors from "cors";
import birdsRouter from "./routes/birds.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import { MikroORM, MongoEntityManager } from "@mikro-orm/mongodb";
import mikroOrmConfig from "./mikro-orm.config.js";

const APP_PATH: string = "/";
const BIRDS_PATH: string = "/api/birds/";
const AUTH_PATH: string = "/api/auth/";

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

  //----- Routers -----
  app.use(BIRDS_PATH, birdsRouter);
  app.use(AUTH_PATH, authRouter);
  app.listen(3000, () => {
    console.log("Listening at http://localhost:3000/");
  });
}

main();
