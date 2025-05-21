import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../controllers/usuario.controller"

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/register', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
