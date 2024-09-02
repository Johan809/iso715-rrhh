import { Router } from "express";
import {
  createPuesto,
  deletePuesto,
  getAllPuestos,
  getPuesto,
  updatePuesto,
} from "../controllers/puesto.controller";
import { authMiddleware } from "../lib/middleware/auth";

const puestoRouter = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/puestos", createPuesto);
  router.get("/puestos", getAllPuestos);
  router.get("/puestos/:id", getPuesto);
  router.put("/puestos/:id", updatePuesto);
  router.delete("/puestos/:id", deletePuesto);

  return router;
};

export { puestoRouter };
