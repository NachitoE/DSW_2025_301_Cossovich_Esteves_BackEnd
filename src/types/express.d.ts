import { EntityManager } from "@mikro-orm/mongodb";
import { Services } from "../services/Services.js";

declare global {
  namespace Express {
    interface Request {
      services: Services;
    }
  }
}
