import { Router } from "express";
import {
  createEmpleado,
  createEmpleadoFromCandidato,
  deleteEmpleado,
  getAllEmpleados,
  getEmpleado,
  updateEmpleado,
} from "../controllers/empleado.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const empleadoRouter = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.RECURSOS));
  router.post("/empleados", createEmpleado);
  router.get("/empleados", getAllEmpleados);
  router.get("/empleados/:id", getEmpleado);
  router.put("/empleados/:id", updateEmpleado);
  router.post("/empleados/from-candidato/:id", createEmpleadoFromCandidato);
  router.delete("/empleados/:id", deleteEmpleado);

  return router;
};

export { empleadoRouter };
