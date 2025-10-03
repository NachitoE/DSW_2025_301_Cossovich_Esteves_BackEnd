import { EntityManager } from "@mikro-orm/mongodb";
import { Services } from "../services/Services.js";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      services: Services;
      auth?: JwtPayload;
    }
  }
}
