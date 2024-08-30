import { Router } from "express";
import {
  createCapacitacion,
  deleteCapacitacion,
  getAllCapacitaciones,
  getCapacitacion,
  updateCapacitacion,
} from "../controllers/capacitacion.controller";

const capacitacionRouter = () => {
  const router = Router();

  router.post("/capacitaciones", createCapacitacion);
  router.get("/capacitaciones", getAllCapacitaciones);
  router.get("/capacitaciones/:id", getCapacitacion);
  router.put("/capacitaciones/:id", updateCapacitacion);
  router.delete("/capacitaciones/:id", deleteCapacitacion);

  return router;
};

export { capacitacionRouter };
