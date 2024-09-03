import { Router } from "express";
import {
  createPuesto,
  deletePuesto,
  getAllPuestos,
  getPuesto,
  updatePuesto,
} from "../controllers/puesto.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const puestoRouter = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.RECURSOS));
  router.post("/puestos", createPuesto);
  router.get("/puestos", getAllPuestos);
  router.get("/puestos/:id", getPuesto);
  router.put("/puestos/:id", updatePuesto);
  router.delete("/puestos/:id", deletePuesto);

  return router;
};

export { puestoRouter };
