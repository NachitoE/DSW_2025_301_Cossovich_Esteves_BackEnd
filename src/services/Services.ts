import { EntityManager } from "@mikro-orm/mongodb";
import { UserService } from "./UserService.js";
import { BirdService } from "./BirdService.js";
import { CommentService } from "./CommentService.js";
import { BirdVisualTraitService } from "./BirdVisualTraitsService.js";
import { AuthService } from "./AuthService.js";
import { BirdSightingService } from "./BirdSightingService.js";
import { FilterService } from "./FilterService.js";

export class Services {
  constructor(private em: EntityManager) {}

  get user(): UserService {
    return new UserService(this.em, this);
  }

  get bird(): BirdService {
    return new BirdService(this.em, this);
  }

  get comment(): CommentService {
    return new CommentService(this.em, this);
  }

  get birdVisualTrait(): BirdVisualTraitService {
    return new BirdVisualTraitService(this.em, this);
  }

  get auth(): AuthService {
    return new AuthService(this);
  }

  get birdSighting(): BirdSightingService{
    return new BirdSightingService(this.em, this);
  }

  get FilterServices(): FilterService{
    return new FilterService(this);
  }
}
