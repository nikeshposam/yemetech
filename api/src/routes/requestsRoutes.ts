import { Router } from "express";
import RequestController from "../controllers/requestController";

const router = Router();

router.get("/", RequestController.getRequests)
router.post("/", RequestController.addRequest)
router.patch("/:id/status", RequestController.updateRequest)

export default router;