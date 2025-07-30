import { Router } from "express";
import type { Bird } from "shared-types";
import crypto from "node:crypto";

const router = Router();

let birds: Bird[] = [
  {
    id: crypto.randomUUID(),
    name: "Cotorra Argentina",
    scientificName: "Myiopsitta monachus",
    description: "Es la especie del cotorro Tony, la mascota de Noah.",
    imageURL: "cotorra_argentina.jpg",
  },
  {
    id: crypto.randomUUID(),
    name: "Cotorra Australiana",
    scientificName: "Melopsittacus undulatus",
    description: "Es un ave de jaula muy popular...",
    imageURL: "cotorra_australiana.jpg",
  },
];

router.get("/", (req, res) => {
  console.log("🐦 Petición recibida en /api/birds");
  res.json({ data: birds });
});

router.get(`${"/"}:id`, (req, res) => {
  const bird = birds.find((x) => x.id === req.params.id);
  if (!bird) {
    res.status(404).send({ message: "bird not found" });
    return;
  }
  res.json({ data: bird });
});

router.post("/", (req, res) => {
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

router.put(`${"/"}:id`, (req, res) => {
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

export default router;
