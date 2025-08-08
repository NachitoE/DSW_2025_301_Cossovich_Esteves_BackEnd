import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Bird as IBird } from "shared-types";

@Entity({ collection: "birds" })
export class Bird implements IBird {
  get id() {
    return this._id.toHexString();
  }
  @PrimaryKey({ type: "string", generated: "uuid" })
  _id!: ObjectId;
  @Property()
  name!: string;
  @Property()
  scientificName!: string;
  @Property()
  description!: string;
  @Property()
  imageURL!: string;
}
