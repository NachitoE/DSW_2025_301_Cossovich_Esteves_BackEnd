import { EntityManager } from "@mikro-orm/mongodb";
import { Bird } from "../entities/Bird.js";
import { BirdVisualTrait } from "../entities/BirdVisualTrait.js";
import { Services } from "./Services.js";


export class FilterService {
    private readonly services: Services;

    constructor(services: Services) {
        this.services = services;
    }

    filterBirds(birds: Array<Bird>, filters:Array<BirdVisualTrait> ){
        const filteredBirds: Array<Bird> = [];

        const fIds:Array<string> = [];
        filters.forEach(filter =>{
            fIds.push(filter.id);
        });

        birds.forEach( bird => {

            const ids: Array<string> = [];

            bird.visualTraits?.forEach(vt => {
               ids.push(vt.birdVisualTraitId);
            });

            var coincide = true;

            ids.forEach(id => {
                if(!fIds.includes(id)){
                    coincide = false
                    
                }
            })
            
            if(coincide){
                filteredBirds.push(bird);
            }
                  
        });

        return filteredBirds



    } 

}


