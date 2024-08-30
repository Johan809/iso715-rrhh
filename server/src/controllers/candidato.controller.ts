import { Request, Response } from "express";
import { Candidato, CandidatoInput } from "../models/candidato.model";
import { Competencia } from "../models/competencia.model";
import { Capacitacion } from "../models/capacitacion.model";
import { ExperienciaLaboral } from "../models/experienciaLaboral.model";
import { Puesto } from "../models/puesto.model";

const createCandidato = async (req: Request, res: Response) => {
  try {
    const {
      cedula,
      nombre,
      puesto,
      departamento,
      salarioAspira,
      competencias,
      capacitaciones,
      experienciaLaboral,
      recomendadoPor,
    } = req.body;

    if (
      !cedula ||
      !nombre ||
      !puesto ||
      !departamento ||
      salarioAspira === undefined
    ) {
      return res.status(422).json({
        message: "Todos los campos son requeridos.",
      });
    }

    const candidatoInput: CandidatoInput = {
      cedula,
      nombre,
      puesto,
      departamento,
      salarioAspira,
      competencias,
      capacitaciones,
      experienciaLaboral,
      recomendadoPor,
    };

    const candidatoCreated = await Candidato.create(candidatoInput);
    return res.status(201).json({ data: candidatoCreated });
  } catch (err) {
    console.error("createCandidato", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getAllCandidatos = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      puestoAspira,
      departamento,
      salarioMin,
      salarioMax,
      estado,
    } = req.query;

    const filter: any = {};

    if (nombre) filter.nombre = new RegExp(nombre as string, "i");
    if (puestoAspira) filter.puestoAspira = puestoAspira;
    if (departamento)
      filter.departamento = new RegExp(departamento as string, "i");
    if (salarioMin || salarioMax) {
      filter.salarioAspira = {};
      if (salarioMin) filter.salarioAspira.$gte = salarioMin;
      if (salarioMax) filter.salarioAspira.$lte = salarioMax;
    }
    if (estado) filter.estado = estado;

    const candidatos = await Candidato.find(filter)
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: candidatos });
  } catch (err) {
    console.error("getAllCandidatos", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidato = await Candidato.findOne({ idsec: id })
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral");

    if (!candidato) {
      return res
        .status(404)
        .json({ message: `Candidato con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: candidato });
  } catch (err) {
    console.error("getCandidato", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const updateCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      puestoAspira,
      departamento,
      salarioAspira,
      competencias,
      capacitaciones,
      experienciaLaboral,
      recomendadoPor,
    } = req.body;

    const candidato = await Candidato.findOne({ idsec: id });

    if (!candidato) {
      return res
        .status(404)
        .json({ message: `Candidato con Id: ${id} no fue encontrado.` });
    }

    const updatedData: Partial<CandidatoInput> = {
      cedula,
      nombre,
      puesto: puestoAspira,
      departamento,
      salarioAspira,
      competencias,
      capacitaciones,
      experienciaLaboral,
      recomendadoPor,
    };

    await Candidato.updateOne({ idsec: id }, updatedData);
    const candidatoUpdated = await Candidato.findOne({ idsec: id })
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral");

    return res.status(200).json({ data: candidatoUpdated });
  } catch (err) {
    console.error("updateCandidato", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const deleteCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Candidato.findOneAndDelete({ idsec: id });

    return res
      .status(200)
      .json({ message: "Candidato eliminado exitosamente." });
  } catch (err) {
    console.error("deleteCandidato", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

export {
  createCandidato,
  getAllCandidatos,
  getCandidato,
  updateCandidato,
  deleteCandidato,
};
