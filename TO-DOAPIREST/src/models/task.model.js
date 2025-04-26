const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  estado: {
    type: String,
    enum: ["pendiente", "en progreso", "completado"],
    default: "pendiente",
  },
  fecha_limite: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
    default: "#ffffff",
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
