import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //referencing User model to connect to users collection in MongoDB.
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
