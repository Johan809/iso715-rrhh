import { Router } from "express";
import {
  createCompetencia,
  deleteCompetencia,
  getAllCompetencias,
  getCompetencia,
  updateCompetencia,
} from "../controllers/competencia.controller";

const competenciaRouter = () => {
  const router = Router();

  router.post("/competencias", createCompetencia);
  router.get("/competencias", getAllCompetencias);
  router.get("/competencias/:id", getCompetencia);
  router.put("/competencias/:id", updateCompetencia);
  router.delete("/competencias/:id", deleteCompetencia);

  return router;
};

export { competenciaRouter };
