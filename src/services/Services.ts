import { EntityManager } from "@mikro-orm/mongodb";
import { UserService } from "./UserService.js";
import { BirdService } from "./BirdService.js";
import { CommentService } from "./CommentService.js";
import { BirdVisualTraitService } from "./BirdVisualTraitsService.js";
import { AuthService } from "./AuthService.js";

export class Services {
  constructor(private em: EntityManager) {}

  get user(): UserService {
    return new UserService(this.em);
  }

  get bird(): BirdService {
    return new BirdService(this.em);
  }

  get comment(): CommentService {
    return new CommentService(this.em);
  }

  get birdVisualTrait(): BirdVisualTraitService {
    return new BirdVisualTraitService(this.em);
  }

  get auth(): AuthService {
    return new AuthService();
  }
}
