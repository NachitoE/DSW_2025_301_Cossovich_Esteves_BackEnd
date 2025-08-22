import { Router } from "express";
import { User } from "../entities/User.js";
import { ObjectId } from "@mikro-orm/mongodb";

const router = Router();

// get user by id
router.get("/:id", async (req, res) => {
	const userId = req.params.id;
	const user = (await req.em.findOne(User, {
		_id: new ObjectId(userId),
	})) as User | null;
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.json(user);
});

export default router;
