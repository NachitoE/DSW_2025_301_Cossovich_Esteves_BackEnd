import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Bird as IBird } from "shared-types";

@Entity()
export class Bird implements IBird {
	@PrimaryKey()
	id!: string;
	@Property()
	name!: string;
	@Property()
	scientificName!: string;
	@Property()
	description!: string;
	@Property()
	imageURL!: string;
}
