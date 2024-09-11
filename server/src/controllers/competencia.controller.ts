import { NextFunction, Request, Response } from "express";
import {
  Competencia,
  COMPETENCIA_ESTADOS,
  CompetenciaInput,
} from "../models/competencia.model";

const createCompetencia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { descripcion, estado } = req.body;

    if (!descripcion) {
      return res.status(422).json({
        message: "El campo Descripción es requerido",
      });
    }

    const competenciaInput: CompetenciaInput = {
      descripcion,
      estado: estado ?? COMPETENCIA_ESTADOS.ACTIVO,
    };

    const competenciaCreated = await Competencia.create(competenciaInput);
    return res.status(201).json({ data: competenciaCreated });
  } catch (err) {
    console.error("error - createCompetencia");
    next(err);
  }
};

const getAllCompetencias = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { descripcion, estado } = req.query;

    const filter: any = {};
    if (descripcion) {
      filter.descripcion = { $regex: descripcion, $options: "i" };
    }
    if (estado) {
      filter.estado = estado;
    }

    const competencias = await Competencia.find(filter)
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: competencias });
  } catch (err) {
    console.error("error - getAllCompetencias");
    next(err);
  }
};

const getCompetencia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const competencia = await Competencia.findOne({ idsec: id });
    if (!competencia) {
      return res
        .status(404)
        .json({ message: `Competencia con Id: ${id} no fue encontrada.` });
    }
    return res.status(200).json({ data: competencia });
  } catch (err) {
    console.error("error - getCompetencia");
    next(err);
  }
};

const updateCompetencia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { descripcion, estado } = req.body;

    const competencia = await Competencia.findOne({ idsec: id });
    if (!competencia) {
      return res
        .status(404)
        .json({ message: `Competencia con Id: ${id} no fue encontrada.` });
    }
    if (!descripcion) {
      return res.status(422).json({
        message: "El campo Descripción es requerido",
      });
    }

    await Competencia.updateOne(
      { _id: competencia._id },
      { descripcion, estado }
    );
    const competenciaUpdated = await Competencia.findOne({ idsec: id });
    return res.status(200).json({ data: competenciaUpdated });
  } catch (err) {
    console.error("error - updateCompetencia");
    next(err);
  }
};

const deleteCompetencia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const competencia = await Competencia.findOne({ idsec: id });
    if (!competencia) {
      return res
        .status(404)
        .json({ message: `Competencia con Id: ${id} no fue encontrada.` });
    }

    await Competencia.findByIdAndDelete(competencia._id);
    return res
      .status(200)
      .json({ message: "Competencia eliminada exitosamente." });
  } catch (err) {
    console.error("error - deleteCompetencia");
    next(err);
  }
};

export {
  createCompetencia,
  getAllCompetencias,
  getCompetencia,
  updateCompetencia,
  deleteCompetencia,
};
