import { Request, Response } from "express";
import {
  Capacitacion,
  CapacitacionInput,
  CapacitacionDocument,
  NIVEL_LIST,
} from "../models/capacitacion.model";

const createCapacitacion = async (req: Request, res: Response) => {
  try {
    const { descripcion, nivel, fechaDesde, fechaHasta, institucion } =
      req.body;

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
    console.error("createCapacitacion", err);
    return res
      .status(500)
      .json({ message: "Error del servidor", Exception: err });
  }
};

const getAllCapacitaciones = async (req: Request, res: Response) => {
  try {
    const capacitaciones = await Capacitacion.find().sort("-createdAt").exec();
    return res.status(200).json({ data: capacitaciones });
  } catch (err) {
    console.error("getAllCapacitaciones", err);
    return res
      .status(500)
      .json({ message: "Error del servidor", Exception: err });
  }
};

const getCapacitacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const capacitacion = await Capacitacion.findOne({ idsec: id });
    if (!capacitacion) {
      return res
        .status(404)
        .json({ message: `Capacitación con Id: ${id} no fue encontrada.` });
    }
    return res.status(200).json({ data: capacitacion });
  } catch (err) {
    console.error("getCapacitacion", err);
    return res
      .status(500)
      .json({ message: "Error del servidor", Exception: err });
  }
};

const updateCapacitacion = async (req: Request, res: Response) => {
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
    console.error("updateCapacitacion", err);
    return res
      .status(500)
      .json({ message: "Error del servidor", Exception: err });
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
