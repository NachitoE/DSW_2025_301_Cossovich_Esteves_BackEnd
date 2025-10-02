import { EntityManager, ObjectId } from "@mikro-orm/mongodb";
import IService from "./IService.js";

export default abstract class BaseService<T> implements IService<T>{
    constructor(protected em: EntityManager){}
    protected abstract getEntityClass(): new () => T;
    async getAll(): Promise<T[]> {
        return await this.em.findAll(this.getEntityClass());
    }
    async findById(id: string): Promise<T | null> {
        return await this.em.findOne(this.getEntityClass(), {  _id: new ObjectId(id) });
    }
    async create(data: any): Promise<T> {
        var newEntity = await this.em.create(this.getEntityClass(), data);
        await this.em.persistAndFlush(newEntity);
        return newEntity;
    }
    async count(): Promise<number> {
        return await this.em.count(this.getEntityClass());
    }
    abstract update(entity: T): Promise<T | null>;
    abstract delete(id: string): Promise<boolean>;
    
}