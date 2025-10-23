import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
    const filters = req.body;
    const birds = await req.services.bird.getAll();
    const filteredBirds = req.services.FilterServices.filterBirds(birds, filters);

});





export default router