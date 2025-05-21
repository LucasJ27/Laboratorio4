import express from 'express';
import dotenv from 'dotenv';
import usuarioRoutes from "./routes/usuario.routes"

dotenv.config();

const app = express();

app.use(express.json());
app.use('/usuarios', usuarioRoutes);

export default app;