import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { User as IUser } from "shared-types";

@Entity({ collection: "users" })
export class User implements IUser {
  get id() {
    return this._id.toHexString();
  }
  get objectId(){
		return this._id;
	}
  @PrimaryKey({ generated: "uuid" })
  _id!: ObjectId;
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
