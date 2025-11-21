import { Router } from "express";
import requestController from "../controllers/requestController.js";

const router = new Router();
router.get("/", requestController.getRequests)
router.post("/", requestController.addRequest)
router.patch("/:id/status", requestController.updateRequest)
export default router;