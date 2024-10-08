import { Router } from "express";
import {
  createIdioma,
  getAllIdiomas,
  getIdioma,
  updateIdioma,
  deleteIdioma,
} from "../controllers/idioma.controller";
import { authMiddleware } from "../lib/middleware/auth";
import { NIVEL_ROLES } from "../lib/constants";

const idiomaRoute = () => {
  const router = Router();

  router.use(authMiddleware(NIVEL_ROLES.RECURSOS));
  router.post("/idiomas", createIdioma);
  router.get("/idiomas", getAllIdiomas);
  router.get("/idiomas/:id", getIdioma);
  router.put("/idiomas/:id", updateIdioma);
  router.delete("/idiomas/:id", deleteIdioma);

  return router;
};

export { idiomaRoute };
