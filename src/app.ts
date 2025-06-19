import express from 'express'
import {Bird} from './bird.js'

const APP_PATH: string = "/"

const app = express()

const birds = [
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

app.use(APP_PATH, (req, res) => 
{
    res.send(birds)
})

app.listen(3000, () =>{
    console.log("Listening at http://localhost:3000/")
})