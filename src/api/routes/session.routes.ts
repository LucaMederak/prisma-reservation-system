import express from "express";

//controllers
import {
  createUserSessionController,
  deleteUserSessionController,
  getUserSessionsController,
} from "@/controllers/session.controller";

//schema
import { createSessionSchema } from "@/schemas/session.schema";

//middleware
import requireUser from "@/middleware/requireUser";
import { validateSchema } from "@/middleware/validateSchema";

const router = express.Router();

router.post(
  "/",
  validateSchema(createSessionSchema),
  createUserSessionController
);

router.get("/", requireUser, getUserSessionsController);
router.delete("/", requireUser, deleteUserSessionController);

export default router;
