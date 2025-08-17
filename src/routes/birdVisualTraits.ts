import { Router } from "express";
import {
	BirdVisualTrait as IBirdVisualTrait,
	BirdVisualTraitType,
} from "shared-types";
import { BirdVisualTrait } from "../entities/BirdVisualTrait.js";
import { EntityManager } from "@mikro-orm/mongodb";

const router = Router();

router.get("/", async (req, res) => {
	const traits = await req.em.find(BirdVisualTrait, {});
	res.json(traits);
});

export async function initBirdVisualTraits(em: EntityManager) {
	const count = await em.count(BirdVisualTrait, {});
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
		const placeholders = data.map((item) =>
			em.create(BirdVisualTrait, {
				type: item.type as BirdVisualTraitType,
				description: item.description,
			})
		);
		await em.persistAndFlush(placeholders);
	}
}
export default router;
