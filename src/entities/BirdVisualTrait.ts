import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import {
	BirdVisualTrait as IBirdVisualTrait,
	BirdVisualTraitType,
} from "shared-types";

@Entity({ collection: "bird_visual_traits" })
export class BirdVisualTrait implements IBirdVisualTrait {
	get id() {
		return this._id.toHexString();
	}
	@PrimaryKey({ type: "string", generated: "uuid" })
	_id!: ObjectId;
	@Property()
	type!: BirdVisualTraitType;
	@Property()
	description!: string;
	//Quizás agregar un "id" extra para cada rasgo visual
}
