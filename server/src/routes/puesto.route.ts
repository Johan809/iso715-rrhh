import { Router } from "express";
import {
  createPuesto,
  deletePuesto,
  getAllPuestos,
  getPuesto,
  updatePuesto,
} from "../controllers/puesto.controller";

const puestoRouter = () => {
  const router = Router();

  router.post("/puestos", createPuesto);
  router.get("/puestos", getAllPuestos);
  router.get("/puestos/:id", getPuesto);
  router.put("/puestos/:id", updatePuesto);
  router.delete("/puestos/:id", deletePuesto);

  return router;
};

export { puestoRouter };
