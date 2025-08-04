import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Bird as IBird } from "shared-types";

@Entity({ collection: "birds" })
export class Bird implements IBird {
  get id(): string {
    return this._id;
  }
  @PrimaryKey({ generated: "uuid" })
  _id!: string;
  @Property()
  name!: string;
  @Property()
  scientificName!: string;
  @Property()
  description!: string;
  @Property()
  imageURL!: string;
}
