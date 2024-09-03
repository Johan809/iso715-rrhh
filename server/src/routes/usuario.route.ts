import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getAllUsuarios,
  getUsuario,
  updateUsuario,
} from "../controllers/usuario.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const usuarioRoute = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.ADMIN));
  router.post("/usuarios", createUsuario);
  router.get("/usuarios", getAllUsuarios);
  router.get("/usuarios/:id", getUsuario);
  router.put("/usuarios/:id", updateUsuario);
  router.delete("/usuarios/:id", deleteUsuario);

  return router;
};

export { usuarioRoute };
