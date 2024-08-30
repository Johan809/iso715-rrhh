import { Router } from "express";
import {
  createCandidato,
  deleteCandidato,
  getAllCandidatos,
  getCandidato,
  updateCandidato,
} from "../controllers/candidato.controller";

const candidatoRouter = () => {
  const router = Router();

  router.post("/candidatos", createCandidato);
  router.get("/candidatos", getAllCandidatos);
  router.get("/candidatos/:id", getCandidato);
  router.put("/candidatos/:id", updateCandidato);
  router.delete("/candidatos/:id", deleteCandidato);

  return router;
};

export { candidatoRouter };
