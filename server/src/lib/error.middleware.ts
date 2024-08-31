import { Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}
