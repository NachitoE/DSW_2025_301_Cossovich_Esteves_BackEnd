import { Router } from "express";
import { Bird } from "../entities/Bird.js";
import { User as IUser } from "shared-types";
import { User } from "../entities/User.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { z } from "zod";

const router = Router();

router.get("/", async (req, res) => {
	const birds = await req.em.findAll(Bird);
	res.json({ data: birds });
});

router.get(`${"/"}:id`, async (req, res) => {
	console.log(req.params.id);
	const bird = await req.em.findOne(Bird, { _id: new ObjectId(req.params.id) });
	if (!bird) {
		res.status(404).send({ message: "bird not found" });
		return;
	}
	res.json({ data: bird });
});

router.post("/", async (req, res) => {
	//check whether user body was sent
	const userBody = req.body.data.user;
	const userSchema = z.object({
		id: z.uuid(),
		username: z.string(),
		role: z.enum(["user", "admin"]),
		googleId: z.string(),
		name: z.string(),
		avatarURL: z.string().optional(),
	});
	if (userSchema.parse(userBody) != userBody) {
		return res.status(401).send({ message: "Invalid user data." });
	}
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
	const { name, scientificName, description, imageURL } = req.body.data.bird;
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
	const bird = await req.em.findOne(Bird, { _id: new ObjectId(req.params.id) });
	if (!bird) {
		res.status(404).send({ message: "bird not found" });
		return;
	}
	const newData = req.body && req.body.data ? req.body.data : {};
	const oldData = { ...bird };

	const replacedBird = req.em.assign(bird, {
		name: newData.name ?? bird.name,
		scientificName: newData.scientificName ?? bird.scientificName,
		description: newData.description ?? bird.description,
		imageURL: newData.imageURL ?? bird.imageURL,
		visualTraits: newData.visualTraits ?? bird.visualTraits,
	});

	await req.em.persistAndFlush(replacedBird);
	res.status(200).json({
		data: replacedBird,
		old_data: oldData,
	});
});

export default router;
