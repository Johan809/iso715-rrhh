import { Request, Response } from "express";
import {
  Competencia,
  COMPETENCIA_ESTADOS,
  CompetenciaInput,
} from "../models/competencia.model";

const createCompetencia = async (req: Request, res: Response) => {
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

  const competenciaCreated = Competencia.create(competenciaInput);
  return res.status(201).json({ data: competenciaCreated });
};

const getAllCompetencias = async (req: Request, res: Response) => {
  const competencias = await Competencia.find().sort("-createdAt").exec();
  return res.status(200).json({ data: competencias });
};

const getCompetencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const competencia = await Competencia.findOne({ _id: id });
  if (!competencia) {
    return res
      .status(404)
      .json({ message: `Competencia con Id: ${id} no fue encontrada.` });
  }
  return res.status(200).json({ data: competencia });
};

const updateCompetencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;

  const competencia = await Competencia.findOne({ _id: id });
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

  await Competencia.updateOne({ _id: id }, { descripcion, estado });
  const competenciaUpdated = await Competencia.findById(id, {
    descripcion,
    estado,
  });
  return res.status(200).json({ data: competenciaUpdated });
};

const deleteCompetencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Competencia.findByIdAndDelete(id);

  return res
    .status(200)
    .json({ message: "Competencia eliminada exitosamente." });
};

export {
  createCompetencia,
  getAllCompetencias,
  getCompetencia,
  updateCompetencia,
  deleteCompetencia,
};
