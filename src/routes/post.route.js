import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  getAll,
  create,
  getById,
  searchByUser,
  searchByUserName,
  update,
  deletePost,
  like,
  comment,
  removeComment,
  countPostController,
} from "../controllers/post.controller.js";

router.post("/", authMiddleware, create);
router.get("/", getAll);
router.get("/countPosts/:id", countPostController);
router.get("/byUserName/:userName", searchByUserName);
router.get("/byUser", authMiddleware, searchByUser);
router.get("/:id", authMiddleware, getById);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/like/:id", authMiddleware, like);
router.patch("/comment/:id", authMiddleware, comment);
router.patch("/removeComment/:id/:idComment", authMiddleware, removeComment);

export default router;
