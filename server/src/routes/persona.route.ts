import { Router } from "express";
import {
  createPersona,
  deletePersona,
  getAllPersonas,
  getPersona,
  updatePersona,
} from "../controllers/persona.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const personaRoute = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.ADMIN));
  router.post("/personas", createPersona);
  router.get("/personas", getAllPersonas);
  router.get("/personas/:id", getPersona);
  router.put("/personas/:id", updatePersona);
  router.delete("/personas/:id", deletePersona);

  return router;
};

export { personaRoute };
