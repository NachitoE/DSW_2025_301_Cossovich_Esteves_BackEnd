import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
    const filters = req.body;
    const birds = await req.services.bird.getAll();
    const filteredBirds = req.services.FilterServices.filterBirds(birds, filters);

});

router.get("/different-filters", async (req, res) => {
    const diffFilters = await req.services.FilterServices.getFilters();
    res.status(200).json({"data": diffFilters})
}
);



export default router