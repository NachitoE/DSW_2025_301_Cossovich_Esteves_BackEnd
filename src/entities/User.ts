import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { User as IUser } from "shared-types";

@Entity({ collection: "users" })
export class User implements IUser {
  get id(): string {
    return this._id;
  }
  @PrimaryKey({ generated: "uuid" })
  _id!: string;
  @Property()
  username!: string;
  @Property()
  googleId!: string;
  @Property()
  name!: string;
  @Property({ nullable: true })
  avatarURL!: string;
  @Property()
  role!: "admin" | "user";
}
