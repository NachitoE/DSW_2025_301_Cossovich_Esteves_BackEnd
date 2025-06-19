import crypto from 'node:crypto'

export class Bird{
    constructor(
        public name: string,
        public scientificName: string,
        public description: string,
        public id: string = crypto.randomUUID()
        //public image: image
    ){}
}