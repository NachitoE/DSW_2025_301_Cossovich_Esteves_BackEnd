import { Router } from "express";
import { z } from "zod";

const router = Router();

// get IComment body
router.post("/", async (req, res) => {
	const commentData = req.body.data;
	const commentSchema = z.object({
		userId: z.uuid(),
		birdId: z.uuid(),
		text: z.string().min(2),
	});
	if (commentSchema.parse(commentData) !== commentData) {
		return res.status(400).json({ message: "Required fields missing" });
	}

	const createdComment = await req.services.comment.create({
		text: commentData.text,
		birdId: commentData.birdId,
		userId: commentData.userId,
		createdAt: new Date(),
	});
	if (!createdComment) {
		return res.status(500).json({ message: "Error creating comment" });
	}
	res.status(201).json({ message: "Created comment", data: createdComment });
});

// get all comments given a birdId
// TODO: maybe validate if bird exists
router.get("/:birdId", async (req, res) => {
	const { birdId } = req.params;
	const comments = await req.services.comment.findByBirdId(birdId);
	const bird = await req.services.bird.findById(birdId);
	if (!bird) {
		return res.status(404).json({ message: "Bird not found" });
	}
	res.status(200).json({ data: comments });
});

export default router;
