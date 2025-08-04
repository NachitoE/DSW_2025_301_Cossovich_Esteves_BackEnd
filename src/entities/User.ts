import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { User as IUser } from "shared-types";

@Entity()
export class User implements IUser {
	@PrimaryKey()
	id!: string;
	@Property()
	username!: string;
	@Property()
	googleId!: string;
	@Property()
	name!: string;
	@Property({ nullable: true })
	email!: string;
	@Property({ nullable: true })
	avatar!: string;
	@Property()
	role!: "admin" | "user";
}
