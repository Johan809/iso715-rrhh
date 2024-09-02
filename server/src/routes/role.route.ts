import { Router } from "express";
import {
  createRole,
  getAllRole,
  getRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller";
import { authMiddleware } from "../lib/middleware/auth";

const roleRoute = () => {
  const router = Router();

  router.use(authMiddleware);
  router.post("/roles", createRole);
  router.get("/roles", getAllRole);
  router.get("/roles/:id", getRole);
  router.put("/roles/:id", updateRole);
  router.delete("/roles/:id", deleteRole);

  return router;
};

export { roleRoute };
