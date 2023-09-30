// app.js

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000; // You can change the port if needed

// Middleware
app.use(bodyParser.json());

// In-memory data store
let tasks = [];

// Routes
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;

  // Input validation
  if (!title || !description || completed === undefined) {
    return res
      .status(400)
      .json({
        error: "Invalid input. Title, description, and completed are required.",
      });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskId));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, completed } = req.body;

  // Input validation
  if (!title || !description || completed === undefined) {
    return res
      .status(400)
      .json({
        error: "Invalid input. Title, description, and completed are required.",
      });
  }

  tasks[taskIndex] = {
    id: parseInt(taskId),
    title,
    description,
    completed,
  };

  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  res.json({ message: "Task deleted successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
