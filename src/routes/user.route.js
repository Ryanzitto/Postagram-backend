import { Router } from "express";
const router = Router();

import userController from "../controllers/user.controller.js";

import { validId, validUser } from "../middlewares/global.middlewares.js";

// Rota para seguir um usuário
router.post("/follow/:id", validId, validUser, userController.followUser);

// Rota para deixar de seguir um usuário
router.post("/unfollow/:id", userController.unfollowUser);

router.post("/", userController.create);

router.get("/", userController.findAll);

router.get("/:userName", userController.findByUserName);

router.get("/:id", validId, validUser, userController.findById);

router.put("/:id", validId, validUser, userController.update);

export default router;
