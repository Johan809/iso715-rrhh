import { Router } from "express";
import {
  createCapacitacion,
  deleteCapacitacion,
  getAllCapacitaciones,
  getCapacitacion,
  updateCapacitacion,
} from "../controllers/capacitacion.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const capacitacionRouter = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.USUARIO));
  router.post("/capacitaciones", createCapacitacion);
  router.get("/capacitaciones", getAllCapacitaciones);
  router.get("/capacitaciones/:id", getCapacitacion);
  router.put("/capacitaciones/:id", updateCapacitacion);
  router.delete("/capacitaciones/:id", deleteCapacitacion);

  return router;
};

export { capacitacionRouter };
