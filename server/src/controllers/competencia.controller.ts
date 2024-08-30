import { Request, Response } from "express";
import {
  Competencia,
  COMPETENCIA_ESTADOS,
  CompetenciaInput,
} from "../models/competencia.model";

const createCompetencia = async (req: Request, res: Response) => {
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
    console.error("createCompetencia", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const getAllCompetencias = async (req: Request, res: Response) => {
  try {
    // Extraer los query parameters
    const { descripcion, estado } = req.query;

    // Construir un objeto de filtro
    const filter: any = {};

    if (descripcion) {
      // Filtro por descripción, insensible a mayúsculas/minúsculas
      filter.descripcion = { $regex: descripcion, $options: "i" };
    }
    if (estado) {
      // Filtro por estado
      filter.estado = estado;
    }

    // Buscar las competencias con los filtros aplicados
    const competencias = await Competencia.find(filter)
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: competencias });
  } catch (err) {
    console.error("getAllCompetencias", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const getCompetencia = async (req: Request, res: Response) => {
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
    console.error("getCompetencia", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const updateCompetencia = async (req: Request, res: Response) => {
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
    console.error("updateCompetencia", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const deleteCompetencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Competencia.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Competencia eliminada exitosamente." });
  } catch (err) {
    console.error("deleteCompetencia", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

export {
  createCompetencia,
  getAllCompetencias,
  getCompetencia,
  updateCompetencia,
  deleteCompetencia,
};
