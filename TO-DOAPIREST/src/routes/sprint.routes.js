const express = require("express");
const router = express.Router();
const Sprint = require("../models/sprint.model");
const Task = require("../models/task.model");

//●	GET /sprints: Obtener todos los sprints

router.get("/", async (req, res) => {
  try {
    const sprints = await Sprint.find();
    console.log("GET ALL", sprints);
    if (sprints.length === 0) {
      return res.status(204).json([]);
    }
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	GET /sprints/:id: Obtener un sprint por ID

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sprint = await Sprint.findById(id);

    if (!sprint) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }

    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	POST /sprints: Crear un sprint
router.post("/", async (req, res) => {
  const { fecha_inicio, fecha_cierre, tareas, color } = req.body;
  if (!fecha_inicio || !fecha_cierre) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }
  const sprint = new Sprint({
    fecha_inicio,
    fecha_cierre,
    tareas,
    color,
  });
  try {
    const newSprint = await sprint.save();
    console.log(newSprint);
    res.status(201).json(newSprint);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//●	PUT /sprints/:id: Editar un sprint
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fecha_inicio, fecha_cierre, tareas, color } = req.body;

  if (!fecha_inicio || !fecha_cierre) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  try {
    const sprint = await Sprint.findById(id);

    if (!sprint) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }

    sprint.fecha_inicio = fecha_inicio || sprint.fecha_inicio;
    sprint.fecha_cierre = fecha_cierre || sprint.fecha_cierre;
    sprint.tareas = tareas || sprint.tareas;
    sprint.color = color || sprint.color;

    const updatedSprint = await sprint.save();

    res.status(200).json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	DELETE /sprints/:id: Eliminar un sprint

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sprint = await Sprint.findById(id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }

    const deleteSprint = await Sprint.deleteOne({ _id: id });

    if (deleteSprint.deletedCount === 0) {
      return res.status(404).json({
        message: "No se pudo eliminar el sprint. Sprint no encontrado.",
      });
    }

    res.status(200).json({ message: "Sprit eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	PUT /sprints/:id/add-task/:taskId Agregar una tarea a un sprint
router.put("/:id/add-task/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params;

    const sprint = await Sprint.findById(id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint no encontrado" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (sprint.tareas.includes(taskId)) {
      return res
        .status(400)
        .json({ message: "La tarea ya está asignada a este sprint" });
    }

    sprint.tareas.push(taskId);
    await sprint.save();

    res.json({ message: "Tarea agregada al sprint", sprint });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
});

module.exports = router;
