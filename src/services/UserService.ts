import { EntityManager } from "@mikro-orm/mongodb";
import { User } from "../entities/User.js";
import BaseService from "./BaseService.js";

export class UserService extends BaseService<User> {
    constructor(em: EntityManager) {
        super(em);
    }
    protected getEntityClass(): new () => User {
        return User;
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        return await this.em.findOne(User, { googleId: googleId });
    }
    /**
     * Reemplaza el usuario en la base de datos, siempre y cuando los cambios sean válidos.
     * @param user 
     */
    async update(user: User): Promise<User | null> {
        const existingUser = await this.findById(user.id);
        if (!existingUser){
            throw new Error("User not found");
        }
        const {name, username, avatarURL} = user;
        if(name) existingUser.name = name;
        if(username) existingUser.username = username;
        if(avatarURL) existingUser.avatarURL = avatarURL;
        await this.em.persistAndFlush(existingUser);
        return existingUser;
    }

    async delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    makeUserName(displayName: string, googleId: string): string {
        return displayName.replace(/\s+/g, "").toLowerCase() + googleId.slice(0, 5);
    }
}