import express from "express";
import type { Bird } from "shared-types";
import cors from "cors";
import crypto from "node:crypto";

const APP_PATH: string = "/";
const BIRDS_PATH: string = "/api/birds/";

const app = express();
app.use(express.json());
app.use(cors());

let birds: Bird[] = [
	{
		id: crypto.randomUUID(),
		name: "Cotorra Argentina",
		scientificName: "Myiopsitta monachus",
		description: "Es la especie del cotorro Tony, la mascota de Noah.",
		imageURL:
			"https://res.cloudinary.com/dzxlynhfm/image/upload/v1752457169/aves/pg2jldqptgv3hs3iusac.jpg",
	},
	{
		id: crypto.randomUUID(),
		name: "Cotorra Australiana",
		scientificName: "Melopsittacus undulatus",
		description: "Es un ave de jaula muy popular...",
		imageURL:
			"https://res.cloudinary.com/dzxlynhfm/image/upload/v1752457828/cotorra_australiana_dzbzf0.jpg",
	},
];

/*
app.use(APP_PATH, (req, res) => 
{
    res.send(birds)
}
)
*/
app.get(BIRDS_PATH, (req, res) => {
	console.log("🐦 Petición recibida en /api/birds");
	res.json({ data: birds });
});

app.get(`${BIRDS_PATH}:id`, (req, res) => {
	const bird = birds.find((x) => x.id === req.params.id);
	if (!bird) {
		res.status(404).send({ message: "bird not found" });
		return;
	}
	res.json({ data: bird });
});

app.post(BIRDS_PATH, (req, res) => {
	const { name, scientificName, description, imageURL } = req.body;
	const newBird: Bird = {
		name,
		scientificName,
		description,
		imageURL,
		id: crypto.randomUUID(),
	};
	birds.push(newBird);
	res.status(201).send({
		message: "Bird succesfully created.",
		data: newBird,
	});
});

app.put(`${BIRDS_PATH}:id`, (req, res) => {
	const birdIndex = birds.findIndex((x) => x.id === req.params.id);
	if (birdIndex == -1) {
		res.status(404).send({ message: "bird not found" });
		return;
	}
	const oldData = { ...birds[birdIndex] };
	const inputData = {
		name: req.body.name,
		scientificName: req.body.scientificName,
		description: req.body.description,
	};
	birds[birdIndex] = { ...birds[birdIndex], ...inputData };
	res.status(200).send({
		message: "Replaced bird data.",
		data: birds[birdIndex],
		old_data: oldData,
	});
});

app.listen(3000, () => {
	console.log("Listening at http://localhost:3000/");
});
