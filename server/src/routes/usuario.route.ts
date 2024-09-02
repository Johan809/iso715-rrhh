import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getAllUsuarios,
  getUsuario,
  updateUsuario,
} from "../controllers/usuario.controller";
import { authMiddleware } from "../lib/middleware/auth";

const usuarioRoute = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/usuarios", createUsuario);
  router.get("/usuarios", getAllUsuarios);
  router.get("/usuarios/:id", getUsuario);
  router.patch("/usuarios/:id", updateUsuario);
  router.delete("/usuarios/:id", deleteUsuario);

  return router;
};

export { usuarioRoute };
