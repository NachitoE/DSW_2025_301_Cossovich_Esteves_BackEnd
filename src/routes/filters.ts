import { Router } from "express";
import { z } from "zod";

const router = Router();

router.post("/", async (req, res) => {
    const filters = req.body;
    // check with zod if it is SelectedFilterOptionDTO 
    const birds = await req.services.bird.getAll();
    const filteredBirds = await req.services.FilterServices.filterBirds(birds, filters);

});

router.get("/different-filters", async (req, res) => {
    const diffFilters = await req.services.FilterServices.getFilters();
    res.status(200).json({"data": diffFilters})
}
);



export default router