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

    async getFilters(){
        const visualTraits = await this.services.birdVisualTrait.getAll();
        // devolvería algo así =>
        // [ 
        // "Size" : ["id1", "id2", "id3"], // -> "Size" : ["Small", "Medium", "Big"]
        // "BeakShape" : ["id4", "id5", "id6"] 
        // ]

        //front =>
        // { "Size" : "Small" , "BeakShape" : "Pointed"}
                
        const diffVTRecord: Record<string, Array<string>> = {};
        visualTraits.forEach(vT => {
            if(!(vT.type in diffVTRecord)){
                diffVTRecord[vT.type] = new Array<string>();
            }
            diffVTRecord[vT.type].push(vT.id) //ponemos el id de size: small por ejemplo...
        })
        return diffVTRecord
    }



}


