import { NextFunction, Request, Response } from "express";
import {
  Capacitacion,
  CapacitacionInput,
  NIVEL_LIST,
} from "../models/capacitacion.model";

const createCapacitacion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { descripcion, nivel, fechaDesde, fechaHasta, institucion } =
      req.body;

    if (!descripcion || !nivel || !fechaDesde || !fechaHasta || !institucion) {
      throw new Error(
        "Todos los campos son obligatorios: Descripción, Nivel, Fecha Desde, Fecha Hasta, Institución"
      );
    }

    if (!Object.values(NIVEL_LIST).includes(nivel)) {
      throw new Error("El nivel proporcionado no es válido.");
    }

    const capacitacionInput: CapacitacionInput = {
      descripcion,
      nivel,
      fechaDesde,
      fechaHasta,
      institucion,
    };

    const capacitacionCreated = await Capacitacion.create(capacitacionInput);
    return res.status(201).json({ data: capacitacionCreated });
  } catch (err) {
    console.log("error - createCapacitacion");
    next(err);
  }
};

const getAllCapacitaciones = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { descripcion, nivel, fechaDesde, fechaHasta, institucion } =
      req.query;

    const filter: any = {};
    if (descripcion) {
      filter.descripcion = { $regex: descripcion, $options: "i" };
    }
    if (nivel) {
      filter.nivel = nivel;
    }
    if (fechaDesde) {
      filter.fechaDesde = { $gte: new Date(fechaDesde as string) };
    }
    if (fechaHasta) {
      filter.fechaHasta = { $lte: new Date(fechaHasta as string) };
    }
    if (institucion) {
      filter.institucion = { $regex: institucion, $options: "i" };
    }

    const capacitaciones = await Capacitacion.find(filter)
      .sort("-createdAt")
      .exec();
    return res.status(200).json({ data: capacitaciones });
  } catch (err) {
    console.log("error - getAllCapacitaciones");
    next(err);
  }
};

const getCapacitacion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const capacitacion = await Capacitacion.findOne({ idsec: id });
    if (!capacitacion) {
      throw new Error(`Capacitación con Id: ${id} no fue encontrada.`);
    }
    return res.status(200).json({ data: capacitacion });
  } catch (err) {
    console.log("error - getCapacitacion");
    next(err);
  }
};

const updateCapacitacion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { descripcion, nivel, fechaDesde, fechaHasta, institucion } =
      req.body;

    const capacitacion = await Capacitacion.findOne({ idsec: id });
    if (!capacitacion) {
      return res
        .status(404)
        .json({ message: `Capacitación con Id: ${id} no fue encontrada.` });
    }

    if (!descripcion || !nivel || !fechaDesde || !fechaHasta || !institucion) {
      return res.status(422).json({
        message:
          "Todos los campos son obligatorios: Descripción, Nivel, Fecha Desde, Fecha Hasta, Institución",
      });
    }

    if (!Object.values(NIVEL_LIST).includes(nivel)) {
      return res.status(422).json({
        message: "El nivel proporcionado no es válido.",
      });
    }

    await Capacitacion.updateOne(
      { _id: capacitacion._id },
      { descripcion, nivel, fechaDesde, fechaHasta, institucion }
    );
    const capacitacionUpdated = await Capacitacion.findOne({ idsec: id });
    return res.status(200).json({ data: capacitacionUpdated });
  } catch (err) {
    console.log("error - updateCapacitacion");
    next(err);
  }
};

const deleteCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const capacitacion = await Capacitacion.findOne({ idsec: id });

    if (!capacitacion) {
      return res
        .status(404)
        .json({ message: `Capacitación con Id: ${id} no fue encontrada.` });
    }

    await Capacitacion.findByIdAndDelete(capacitacion._id);

    return res
      .status(200)
      .json({ message: "Capacitación eliminada exitosamente." });
  } catch (err) {
    console.error("deleteCapacitacion", err);
    return res
      .status(500)
      .json({ message: "Error del servidor", Exception: err });
  }
};

export {
  createCapacitacion,
  getAllCapacitaciones,
  getCapacitacion,
  updateCapacitacion,
  deleteCapacitacion,
};
