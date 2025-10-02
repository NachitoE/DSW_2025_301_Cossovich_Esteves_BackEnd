export default interface IService<T> {
    getAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: any): Promise<T>;
    update(entity: T): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
