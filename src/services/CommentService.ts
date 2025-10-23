import { EntityManager } from "@mikro-orm/mongodb";
import { Comment } from "../entities/Comment.js";
import BaseService from "./BaseService.js";
import { Services } from "./Services.js";

export class CommentService extends BaseService<Comment>{
    constructor(em: EntityManager, services: Services) {
        super(em, services);
    }
    protected getEntityClass(): new () => Comment {
        return Comment;
    }
    async update(entity: Comment): Promise<Comment | null> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async findByBirdId(birdId: string): Promise<Comment[] | null> {
        return await this.em.find(Comment, { birdId: birdId });
    }
}