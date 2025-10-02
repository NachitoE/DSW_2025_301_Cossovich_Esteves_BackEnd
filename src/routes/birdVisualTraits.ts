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

export async function initBirdVisualTraits(birdVisualTraitService: BirdVisualTraitService) {
	const count = await birdVisualTraitService.count();
	if (count === 0) {
		console.log("Initializing BirdVisualTrait...");
		const data = [
			// BeakShape
			{ type: "BeakShape", description: "Short" },
			{ type: "BeakShape", description: "Large" },
			{ type: "BeakShape", description: "Curved" },
			{ type: "BeakShape", description: "Straight" },
			{ type: "BeakShape", description: "Hooked" },

			// PlumagePattern
			{ type: "PlumagePattern", description: "Spotted" },
			{ type: "PlumagePattern", description: "Striped" },
			{ type: "PlumagePattern", description: "Solid color" },
			{ type: "PlumagePattern", description: "Iridescent" },

			// LegColor
			{ type: "LegColor", description: "Yellow" },
			{ type: "LegColor", description: "Black" },
			{ type: "LegColor", description: "Pink" },
			{ type: "LegColor", description: "Gray" },

			// Size
			{ type: "Size", description: "Small" },
			{ type: "Size", description: "Medium" },
			{ type: "Size", description: "Large" },

			// TailShape
			{ type: "TailShape", description: "Forked" },
			{ type: "TailShape", description: "Rounded" },
			{ type: "TailShape", description: "Pointed" },
			{ type: "TailShape", description: "Square" },
		];
		const placeholders = data.map(async (item) =>
			await birdVisualTraitService.create({
				type: item.type as BirdVisualTraitType,
				description: item.description,
			})
		);
	}
}
export default router;
