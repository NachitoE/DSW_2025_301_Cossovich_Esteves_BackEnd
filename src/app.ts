import express from 'express'
const APP_PATH: string = "/"

const app = express()

app.use(APP_PATH, (req, res) => 
{
    res.send("HOOLAAAAAA :P")
})

app.listen(3000, () =>{
    console.log("Listening at http://localhost:3000/")
})