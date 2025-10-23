import { BirdSighting as IBirdSighting } from "shared-types";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";


@Entity({ collection: "bird_sightings" })
    export class BirdSighting implements IBirdSighting{
   
    get id() {
		return this._id.toHexString();
	}
	get objectId(){
		return this._id;
	}
	@PrimaryKey({ type: "string", generated: "uuid" })
	_id!: ObjectId;
    @Property()
    dateTime!: Date;
    @Property()
    ubicationLatitude!: number;
    @Property()
    ubicationLongitude!: number;
    @Property()
    BirdID!: string;
    @Property()
    UserID!: string;
}