import { Router } from "express";
import {
  createExperienciaLaboral,
  getAllExperienciasLaborales,
  getExperienciaLaboral,
  updateExperienciaLaboral,
  deleteExperienciaLaboral,
} from "../controllers/experienciaLaboral.controller";
import { authMiddleware } from "../lib/middleware/auth";

const experienciaLaboralRouter = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/experiencias-laborales", createExperienciaLaboral);
  router.get("/experiencias-laborales", getAllExperienciasLaborales);
  router.get("/experiencias-laborales/:id", getExperienciaLaboral);
  router.put("/experiencias-laborales/:id", updateExperienciaLaboral);
  router.delete("/experiencias-laborales/:id", deleteExperienciaLaboral);

  return router;
};

export { experienciaLaboralRouter };
