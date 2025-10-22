import { Router } from "express";
import { BirdSighting } from "../entities/BirdSighting.js";
import { z } from "zod";

const router = Router();

router.get("/", async (req, res) => {
	const birdSighting = await req.services.birdSighting.getAll();
	res.json({ data: birdSighting });
});

router.post("/", async (req, res) => {
	const data = req.body;
	
	const birdSighting = await req.services.birdSighting.create(data);
	res.status(201)
});

router.put(`${"/"}:id`, async (req, res) => {
	res.status(200)
});

export default router;