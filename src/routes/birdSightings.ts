import { Router } from "express";
import { BirdSighting } from "../entities/BirdSighting.js";
import { z } from "zod";

const router = Router();

router.get("/", async (req, res) => {
	const birdSighting = await req.services.birdSighting.getAll();
	res.json({ data: birdSighting });
});



export default router