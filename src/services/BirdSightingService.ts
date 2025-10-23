import { EntityManager } from "@mikro-orm/mongodb";
import { BirdSighting } from "../entities/BirdSighting.js";
import BaseService from "./BaseService.js";
import { Services } from "./Services.js";

export class BirdSightingService extends BaseService<BirdSighting> {
    constructor(em: EntityManager, services: Services) {
        super(em, services);
    }
    
    protected getEntityClass(): new() => BirdSighting {
        return BirdSighting;
    }

    async update(entity: BirdSighting): Promise<BirdSighting | null> {
        return null;
    }

    async delete(id: string): Promise<boolean> {
        return false;
    }
}