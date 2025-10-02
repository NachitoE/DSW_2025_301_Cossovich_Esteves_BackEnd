import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Comment as IComment } from "shared-types";

@Entity({ collection: "comments" })
export class Comment implements IComment {
  get id() {
    return this._id.toHexString();
  }
  get objectId(){
		return this._id;
	}
  @PrimaryKey({ generated: "uuid" })
  _id!: ObjectId;
  @Property()
  userId!: string;
  @Property()
  birdId!: string;
  @Property()
  text!: string;
  @Property()
  createdAt!: Date;
}
