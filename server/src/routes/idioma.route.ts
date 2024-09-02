import { Router } from "express";
import {
  createIdioma,
  getAllIdiomas,
  getIdioma,
  updateIdioma,
  deleteIdioma,
} from "../controllers/idioma.controller";
import { authMiddleware } from "../lib/middleware/auth";

const idiomaRoute = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/idiomas", createIdioma);
  router.get("/idiomas", getAllIdiomas);
  router.get("/idiomas/:id", getIdioma);
  router.put("/idiomas/:id", updateIdioma);
  router.delete("/idiomas/:id", deleteIdioma);

  return router;
};

export { idiomaRoute };
