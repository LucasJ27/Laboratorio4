const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { config } = require("dotenv");

config();

const app = express();
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;
const tasksRoutes = require("./routes/task.routes");
const sprintRoutes = require("./routes/sprint.routes");
const backlogRoutes = require("./routes/backlog.routes");

app.use("/tasks", tasksRoutes);
app.use("/sprints", sprintRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor iniciado en el puerto: ${port}`));
