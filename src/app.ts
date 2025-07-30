import express from "express";
import cors from "cors";
import birdsRouter from "./routes/birds.js";
import usersRouter from "./routes/users.js";

const APP_PATH: string = "/";
const BIRDS_PATH: string = "/api/birds/";

const app = express();
app.use(express.json());
app.use(cors());
app.use(BIRDS_PATH, birdsRouter);
/*
app.use(APP_PATH, (req, res) => 
{
    res.send(birds)
}
)
*/

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000/");
});
