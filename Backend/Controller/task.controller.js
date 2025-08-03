import Task from "../model/task.model.js";

export const createTask = async (req, res) => {
  const task = new Task({
    text: req.body.text,
    completed: req.body.completed,
  });

  try {
    const newTask = await task.save();
    res.status(201).json({ message: "Task Created Successfully", newTask });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occurred while Creating a Task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(201).json({ message: "Tasks Fetched Successfully", tasks });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occurred while Fetching Tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
     if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(201).json({ message: "Tasks Updated Successfully", task });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occurred while Updating Task", error:error.message });
  }
};

export const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(201).json({ message: "Tasks Deleted Successfully"});
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error occurred while Deleting Task", error:error.message });
        
    }
}