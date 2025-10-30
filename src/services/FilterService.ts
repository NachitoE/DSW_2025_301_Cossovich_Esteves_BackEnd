import { EntityManager } from "@mikro-orm/mongodb";
import { Bird } from "../entities/Bird.js";
import { BirdVisualTrait } from "../entities/BirdVisualTrait.js";
import { Services } from "./Services.js";
import { FilterOptionsDTO, SelectedFilterOptionDTO } from "shared-types";


export class FilterService {
    private readonly services: Services;

    constructor(services: Services) {
        this.services = services;
    }

    async filterBirds(birds: Array<Bird>, selectedFilters: Array<SelectedFilterOptionDTO> ){
        const filteredBirds: Array<Bird> = [];
        const nonEmptySelectedFilters = selectedFilters.filter(x => x.option)
        const filters = (await Promise.all(
            nonEmptySelectedFilters.map(async (selFilter) => {
                const vT = await this.services.birdVisualTrait.findById(selFilter.option);
                return vT || null;
            })
        )).filter((vT): vT is BirdVisualTrait => vT !== null);
        
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
            
            fIds.forEach(filterId => {
                console.log(ids.includes(filterId))
                if(!ids.includes(filterId)){
                    coincide = false
                    
                }
            })
            
            if(coincide){
                filteredBirds.push(bird);
            }
            
                  
        });
        
        return filteredBirds



    } 

    async getFilters(): Promise<Array<FilterOptionsDTO>>{
        const visualTraits = await this.services.birdVisualTrait.getAll();
        // devolvería algo así =>
        // [ 
        // "Size" : ["id1", "id2", "id3"], // -> "Size" : ["Small", "Medium", "Big"]
        // "BeakShape" : ["id4", "id5", "id6"] 
        // ]

        //front =>
        // { "Size" : "Small" , "BeakShape" : "Pointed"}
               
        const diffFilterOptions: Array<FilterOptionsDTO> = []
        const diffVTRecord: Record<string, Array<string>> = {};
        visualTraits.forEach(vT => {
            if(!(vT.type in diffVTRecord)){
                diffVTRecord[vT.type] = new Array<string>();
            }
            diffVTRecord[vT.type].push(vT.id) //ponemos el id de size: small por ejemplo...
        });
        // poner en el arr lo que recolectamos en el record
        Object.keys(diffVTRecord).forEach((key) => {
            diffFilterOptions.push({
                filter: key,
                options: diffVTRecord[key]
            })
        });
        return diffFilterOptions
    }



}


