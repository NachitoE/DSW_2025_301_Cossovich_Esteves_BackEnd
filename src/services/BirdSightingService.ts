import { EntityManager } from "@mikro-orm/mongodb";
import { BirdSighting } from "../entities/BirdSighting.js";
import BaseService from "./BaseService.js";

export class BirdSightingService extends BaseService<BirdSighting> {
    constructor(em: EntityManager){
        super(em);
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