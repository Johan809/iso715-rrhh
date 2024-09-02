import { Router } from "express";
import {
  createCandidato,
  deleteCandidato,
  getAllCandidatos,
  getCandidato,
  updateCandidato,
} from "../controllers/candidato.controller";
import { authMiddleware } from "../lib/middleware/auth";

const candidatoRouter = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/candidatos", createCandidato);
  router.get("/candidatos", getAllCandidatos);
  router.get("/candidatos/:id", getCandidato);
  router.put("/candidatos/:id", updateCandidato);
  router.delete("/candidatos/:id", deleteCandidato);

  return router;
};

export { candidatoRouter };
