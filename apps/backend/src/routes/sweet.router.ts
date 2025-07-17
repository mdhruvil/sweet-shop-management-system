import { Router } from "express";
import { SweetController } from "../controllers/sweet.controller.js";
import { InMemorySweetRepository } from "../repositories/sweet.repository.js";
import { SweetService } from "../services/sweet.service.js";

const router = Router();

const sweetRepository = new InMemorySweetRepository();
const sweetService = new SweetService(sweetRepository);
const sweetController = new SweetController(sweetService);

router.get("/sweets", (req, res) => sweetController.getAllSweets(req, res));
router.get("/sweets/search", (req, res) =>
  sweetController.searchSweets(req, res),
);
router.get("/sweets/:id", (req, res) => sweetController.getSweetById(req, res));
router.post("/sweets", (req, res) => sweetController.createSweet(req, res));
router.delete("/sweets/:id", (req, res) =>
  sweetController.deleteSweet(req, res),
);
router.post("/sweets/:id/purchase", (req, res) =>
  sweetController.purchaseSweet(req, res),
);
router.post("/sweets/:id/restock", (req, res) =>
  sweetController.restockSweet(req, res),
);
export { router as sweetRouter };
