import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
	const commentData = req.body.data;
	if (!req.auth) {
		res.status(401).json({ message: "No autenticado" });
		return;
	} 
	const user = await req.services.user.findById(req.auth.id)
	
	const commentSchema = z.object({
		birdId: z.string(),
		text: z.string().min(1),
	});
	const parsed = commentSchema.safeParse(commentData);
	if (!parsed.success) {
		return res.status(400).json({ message: "Required fields missing", errors: parsed.error.message });
	}
	const payload = parsed.data;
	const createdComment = await req.services.comment.create({
		text: payload.text,
		birdId: payload.birdId,
		userId: user?.id,
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
