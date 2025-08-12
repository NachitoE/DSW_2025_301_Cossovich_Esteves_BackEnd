import { Router } from "express";
import { Comment as IComment } from "shared-types";
import { Comment } from "../entities/Comment.js";

const router = Router();

// get IComment body
router.post("/", async (req, res) => {
	const { text, birdId, userId } = req.body;

	if (!text || !birdId || !userId) {
		return res.status(400).json({ msg: "Faltan campos obligatorios" });
	}

	const comment = new Comment();
	comment.text = text;
	comment.birdId = birdId;
	comment.userId = userId;
	comment.createdAt = new Date();

	await req.em.persistAndFlush(comment);
	res.status(201).json(comment);
});

// get all comments given a birdId
// TODO: maybe validate if bird exists
router.get("/:birdId", async (req, res) => {
	const { birdId } = req.params;
	const comments = await req.em.find(Comment, { birdId: birdId });
	if (!comments) {
		res
			.status(404)
			.json({ msg: "No comments found for this bird OR bird not existing" });
	}
	res.status(200).json(comments);
});

export default router;
