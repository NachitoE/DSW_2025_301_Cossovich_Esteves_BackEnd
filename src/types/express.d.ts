import { EntityManager } from "@mikro-orm/mongodb";

declare global {
  namespace Express {
    interface Request {
      em: EntityManager;
    }
  }
}
