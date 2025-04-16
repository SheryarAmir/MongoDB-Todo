import express from "express";
const router = express.Router();

import * as todoController from "../controllers/todoController";

router.post("/", todoController.createTodo);
router.get("/", todoController.getAllTodos);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.patch("/:id/complete", todoController.completeTodo);

export default router; 