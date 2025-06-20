import express from 'express'
import {Bird} from './bird.js'

const APP_PATH: string = "/"
const BIRDS_PATH: string = "/api/birds/"

const app = express()
app.use(express.json())

let birds = [
    new Bird(
        'Cotorra Argentina',
        'Myiopsitta monachus',
        'Es la especie del cotorro Tony, la mascota de Noah.'
    ),
    new Bird(
        'Cotorra Australiana',
        'Melopsittacus undulatus',
        'Es un ave de jaula muy popular, no solo por sus vivos colores sino también por su fácil adaptación.'
    ),
]

/*
app.use(APP_PATH, (req, res) => 
{
    res.send(birds)
}
)
*/
app.get(BIRDS_PATH, (req, res) => 
    {
        res.json({data: birds})
    }
)

app.get(`${BIRDS_PATH}:id`, (req, res) => 
    {
        const bird = birds.find((x) => x.id === req.params.id)
        if(!bird){
            res.status(404).send({message: 'bird not found'})
            return;
        }
        res.json({data: bird})
    }
)

app.post(BIRDS_PATH, (req, res) => 
    {
    const {name, scientificName, description} = req.body
    const newBird = new Bird(name, scientificName, description)
    birds.push(newBird)
    res.status(201)
    .send({
        message: 'Bird succesfully created.',
        data: newBird
    })
    }
)

app.put(`${BIRDS_PATH}:id`, (req, res) => 
    {
        const birdIndex = birds.findIndex((x) => x.id === req.params.id)
        if(birdIndex == -1){
            res.status(404).send({message: 'bird not found'})
            return;
        }
        const oldData = { ...birds[birdIndex] }
        const inputData = {
            name: req.body.name,
            scientificName: req.body.scientificName,
            description: req.body.description
        }
        birds[birdIndex] = {...birds[birdIndex], ...inputData}
        res.status(200).send({
            message: 'Replaced bird data.',
            data: birds[birdIndex],
            old_data: oldData
        })
    }
)

app.listen(3000, () =>{
    console.log("Listening at http://localhost:3000/")
})