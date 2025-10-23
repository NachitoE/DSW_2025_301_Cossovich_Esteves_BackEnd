import { EntityManager } from "@mikro-orm/mongodb";
import { BirdVisualTrait } from "../entities/BirdVisualTrait.js";
import BaseService from "./BaseService.js";
import { Services } from "./Services.js";

export class BirdVisualTraitService extends BaseService<BirdVisualTrait>{
    constructor(em: EntityManager, services: Services) {
        super(em, services);
    }
    protected getEntityClass(): new () => BirdVisualTrait {
        return BirdVisualTrait;
    }
    async update(entity: BirdVisualTrait): Promise<BirdVisualTrait | null> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}