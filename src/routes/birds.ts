import { Router } from "express";
import { Bird } from "../entities/Bird.js";
import { User as IUser } from "shared-types";
import { User } from "../entities/User.js";

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
  //check whether user body was sent
  const userBody = req.body.user as IUser;
  if (!userBody) {
    return res.status(403).send({ message: "Non detected login." });
  }
  //check whether user is admin or exists
  const user = (await req.em.findOne(User, {
    googleId: userBody.googleId,
  })) as User;

  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Only admins are allowed to create birds." });
  }
  const { name, scientificName, description, imageURL } = req.body.bird;
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
