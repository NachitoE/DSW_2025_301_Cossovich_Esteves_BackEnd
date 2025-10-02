import { Router } from "express";

const router = Router();

// get user by id
router.get("/:id", async (req, res) => {
	const userId = req.params.id;
	const user = await req.services.user.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.json(user);
});

export default router;
