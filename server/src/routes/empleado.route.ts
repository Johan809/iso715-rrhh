import { Router } from "express";
import {
  createEmpleado,
  createEmpleadoFromCandidato,
  deleteEmpleado,
  getAllEmpleados,
  getEmpleado,
  updateEmpleado,
} from "../controllers/empleado.controller";

const empleadoRouter = () => {
  const router = Router();

  router.post("/empleados", createEmpleado);
  router.get("/empleados", getAllEmpleados);
  router.get("/empleados/:id", getEmpleado);
  router.put("/empleados/:id", updateEmpleado);
  router.post("/empleados/from-candidato/:id", createEmpleadoFromCandidato);
  router.delete("/empleados/:id", deleteEmpleado);

  return router;
};

export { empleadoRouter };
