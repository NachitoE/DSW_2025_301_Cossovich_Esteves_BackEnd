import { EntityManager } from "@mikro-orm/mongodb";
import { Bird } from "../entities/Bird.js";
import BaseService from "./BaseService.js";
import { Services } from "./Services.js";

export class BirdService extends BaseService<Bird> {
    constructor(em: EntityManager, services: Services) {
        super(em, services);
    }
    protected getEntityClass(): new () => Bird {
        return Bird;
    }
    async update(bird: Bird): Promise<Bird | null> {
        const existingBird = await this.findById(bird.id);
        if (!existingBird) {
            throw new Error("Bird not found");
        }
        const { name, scientificName, description, imageURL } = bird;
        if (name) existingBird.name = name;
        if (scientificName) existingBird.scientificName = scientificName;
        if (description) existingBird.description = description;
        if (imageURL) existingBird.imageURL = imageURL;
        await this.em.persistAndFlush(existingBird);
        return existingBird;
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}