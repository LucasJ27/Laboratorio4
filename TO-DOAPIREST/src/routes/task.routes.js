const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");

//●	GET /tasks: Obtener todas las tareas
router.get("/", async (req, res) => {
  try {
    const tareas = await Task.find();
    console.log("GET ALL", tareas);
    if (tareas.length === 0) {
      return res.status(204).json([]);
    }
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	GET /tasks/:id: Obtener una tarea por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Buscamos la tarea por su ID
    const task = await Task.findById(id);

    // Si no encontramos la tarea, respondemos con un error 404
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Respondemos con la tarea
    res.status(200).json(task);
  } catch (error) {
    // En caso de error en la base de datos, respondemos con un error 500
    res.status(500).json({ message: error.message });
  }
});

//●	POST /tasks: Crear una tarea
router.post("/", async (req, res) => {
  const { titulo, descripcion, estado, fecha_limite, color } = req.body;
  if (!titulo || !estado || !fecha_limite) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }
  const tarea = new Task({
    titulo,
    descripcion,
    estado,
    fecha_limite,
    color,
  });
  try {
    const newTarea = await tarea.save();
    console.log(newTarea);
    res.status(201).json(newTarea);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//●	PUT /tasks/:id: Editar una tarea
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado, fecha_limite, color } = req.body;

  if (!titulo || !estado || !fecha_limite) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  try {
    const tarea = await Task.findById(id);

    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;
    tarea.estado = estado || tarea.estado;
    tarea.fecha_limite = fecha_limite || tarea.fecha_limite;
    tarea.color = color || tarea.color;

    const updatedTarea = await tarea.save();

    res.status(200).json(updatedTarea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//●	DELETE /tasks/:id: Eliminar una tarea
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Task.findById(id);
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const sprintConTarea = await Sprint.findOne({ tareas: id });

    if (sprintConTarea) {
      return res.status(400).json({
        message:
          "No se puede eliminar la tarea porque está asignada a un sprint",
      });
    }

    await tarea.deleteOne();
    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
