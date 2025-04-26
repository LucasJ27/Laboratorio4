const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
  fecha_inicio: {
    type: Date,
    required: true,
  },
  fecha_cierre: {
    type: Date,
    required: true,
  },
  tareas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  color: {
    type: String,
    default: "#cccccc",
  },
});

const Sprint = mongoose.model("Sprint", sprintSchema);

module.exports = Sprint;
