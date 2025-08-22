import { Router } from "express";
import { Comment as IComment } from "shared-types";
import { Comment } from "../entities/Comment.js";
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

	const createdComment = await req.em.create(Comment, {
		text: commentData.text,
		birdId: commentData.birdId,
		userId: commentData.userId,
		createdAt: new Date(),
	});

	await req.em.persistAndFlush(createdComment);
	res.status(201).json({ message: "Created comment", data: createdComment });
});

// get all comments given a birdId
// TODO: maybe validate if bird exists
router.get("/:birdId", async (req, res) => {
	const { birdId } = req.params;
	const comments = await req.em.find(Comment, { birdId: birdId });
	if (!comments) {
		res.status(404).json({
			message: "No comments found for this bird OR bird not existing",
		});
	}
	res.status(200).json({ data: comments });
});

export default router;
