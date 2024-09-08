import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (requiredRole: number) => {
  const JWT_SECRET = <string>process.env.JWT_SECRET;

  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedUserData = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
        role: number;
      };
      const userRole = decodedUserData.role;
      if (userRole < requiredRole) {
        return res
          .status(403)
          .send({ message: "Prohibido: Permisos insuficientes" });
      }

      req["user"] = decodedUserData;
      next();
    } catch (err) {
      console.error("authMiddleware", err);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

export { authMiddleware };
