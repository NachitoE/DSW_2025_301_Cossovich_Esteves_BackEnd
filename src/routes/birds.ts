import { Router } from "express";
import { Bird } from "../entities/Bird.js";

const router = Router();

router.get("/", async (req, res) => {
  const birds = await req.em.findAll(Bird);
  res.json({ data: birds });
});

router.get(`${"/"}:id`, async (req, res) => {
  const bird = await req.em.findOne(Bird, { _id: req.params.id });
  if (!bird) {
    res.status(404).send({ message: "bird not found" });
    return;
  }
  res.json({ data: bird });
});

router.post("/", async (req, res) => {
  const { name, scientificName, description, imageURL } = req.body;
  const createdBird = req.em.create(Bird, {
    name,
    scientificName,
    description,
    imageURL,
  });
  await req.em.persistAndFlush(createdBird);
  res.status(201).send({
    message: "Bird succesfully created.",
    data: createdBird,
  });
});

router.put(`${"/"}:id`, async (req, res) => {
  const bird = await req.em.findOne(Bird, { _id: req.params.id });
  if (!bird) {
    res.status(404).send({ message: "bird not found" });
    return;
  }
  const oldData = { ...bird };
  const inputData = {
    name: req.body.name,
    scientificName: req.body.scientificName,
    description: req.body.description,
  };
  const replacedBird = req.em.assign(bird, inputData);
  await req.em.persistAndFlush(replacedBird);
  res.status(200).send({
    message: "Replaced bird data.",
    data: replacedBird,
    old_data: oldData,
  });
});

export default router;
