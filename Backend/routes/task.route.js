import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../Controller/task.controller.js";

const router = express.Router();

//create request
router.post("/create", createTask);
//fetch request
router.get("/fetch", getTasks);
//update request
router.put("/update/:id", updateTask);
//delete request
router.delete("/delete/:id",deleteTask);

export default router;
