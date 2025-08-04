import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../Controller/task.controller.js";
import { authenticate } from "../middleware/authorize.js";

const router = express.Router();

//create request
router.post("/create",authenticate, createTask);
//fetch request
router.get("/fetch",authenticate, getTasks);
//update request
router.put("/update/:id",authenticate, updateTask);
//delete request
router.delete("/delete/:id", authenticate, deleteTask);

export default router;
