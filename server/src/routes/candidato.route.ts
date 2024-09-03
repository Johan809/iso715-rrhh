import { Router } from "express";
import {
  createCandidato,
  deleteCandidato,
  getAllCandidatos,
  getCandidato,
  updateCandidato,
} from "../controllers/candidato.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const candidatoRouter = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.USUARIO));
  router.post("/candidatos", createCandidato);
  router.get("/candidatos", getAllCandidatos);
  router.get("/candidatos/:id", getCandidato);
  router.put("/candidatos/:id", updateCandidato);
  router.delete("/candidatos/:id", deleteCandidato);

  return router;
};

export { candidatoRouter };
