import React, { useEffect, useState } from "react";
import axios from "axios";
import { createTask } from "../../../../Backend/Controller/task.controller";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4001/task/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.tasks);
        setTasks(response.data.tasks);
        setError(null);
      } catch (error) {
        setError("Failed to Fetch Tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const taskCreate = async () => {
    if (!newTask) return;
    try {
      const response = await axios.post(
        "http://localhost:4001/task/create",
        {
          text: newTask,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.newTask);
      setTasks([...tasks, response.data.newTask]);
      setNewTask("");
    } catch (error) {
      setError("Failed to Create Task");
    }
  };

  const taskStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const response = await axios.put(
        `http://localhost:4001/task/update/${id}`,
        {
          ...task,
          completed: !task.completed,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.task);
      setTasks(tasks.map((t) => (t._id === id ? response.data.task : t)));
    } catch (error) {
      setError("Failed to Find Task Status");
    }
  };

  const taskDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/task/delete/${id}`, {
        withCredentials: true,
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to Delete Task ");
    }
  };

  const remainingTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Your Tasks
          </h1>

          {/* Add Task Form */}
          <div className="flex mb-8">
            <input
              type="text"
              placeholder="Add a New Task"
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && taskCreate()}
            />
            <button
              onClick={taskCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-lg transition duration-200"
            >
              Add Task
            </button>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="text-center py-8">
              <span className="text-gray-500">Loading . . .</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold py-8">
              {error}
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={task._id || index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => taskStatus(task._id)}
                      className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span
                      className={`${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => taskDelete(task._id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-center text-gray-600">
            {remainingTasks} {remainingTasks === 1 ? "Task" : "Tasks"} Remaining
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
