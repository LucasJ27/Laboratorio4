const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
//●	GET /backlog: Obtener el backlog

router.get("/", async (req, res) => {
  try {
    const backlog = await Backlog.findOne().populate("tareas");
    if (!backlog) {
      return res.status(404).json({ message: "No existe un backlog aún." });
    }
    res.status(200).json(backlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	POST /backlog: Crear backlog (solo uno en este caso)

router.post("/", async (req, res) => {
  try {
    const existingBacklog = await Backlog.findOne();
    if (existingBacklog) {
      return res.status(400).json({ message: "Ya existe un backlog." });
    }

    const newBacklog = new Backlog({ tareas: [] });
    await newBacklog.save();
    res.status(201).json(newBacklog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	PUT /backlog/add-task/:taskId: Agregar una tarea al backlog

router.put("/add-task/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const backlog = await Backlog.findOne();
    if (!backlog) {
      return res.status(404).json({ message: "No existe un backlog." });
    }

    const tarea = await Task.findById(taskId);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    if (backlog.tareas.includes(taskId)) {
      return res
        .status(400)
        .json({ message: "La tarea ya está en el backlog." });
    }

    backlog.tareas.push(taskId);
    await backlog.save();

    res.status(200).json({ message: "Tarea agregada al backlog.", backlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
