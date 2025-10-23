import { Router } from "express";
import {
	BirdVisualTrait as IBirdVisualTrait,
	BirdVisualTraitType,
} from "shared-types";
import { BirdVisualTraitService } from "../services/BirdVisualTraitsService.js";

const router = Router();

router.get("/", async (req, res) => {
	const traits = await req.services.birdVisualTrait.getAll();
	res.json({ data: traits });
});

router.get("/:id", async (req, res) => {
	const trait = await req.services.birdVisualTrait.findById(
		req.params.id
	);
	if (!trait) {
		return res.status(404).json({ message: "Trait not found" });
	}
	res.json({ data: trait });
});

export default router;
