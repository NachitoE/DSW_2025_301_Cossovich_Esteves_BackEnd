import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Comment as IComment } from "shared-types";

@Entity({ collection: "comments" })
export class Comment implements IComment {
	get id() {
		return this._id.toHexString();
	}
	@PrimaryKey({ generated: "uuid" })
	_id!: ObjectId;
	userId!: string;
	birdId!: string;
	text!: string;
	createdAt!: Date;
}
