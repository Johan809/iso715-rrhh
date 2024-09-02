import { NextFunction, Request, Response } from "express";
import { Candidato, CandidatoInput } from "../models/candidato.model";

const createCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      throw new Error("Todos los campos son requeridos.");
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
    console.log("error - createCandidato");
    next(err);
  }
};

const getAllCandidatos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    console.log("error - getAllCandidatos");
    next(err);
  }
};

const getCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const candidato = await Candidato.findOne({ idsec: id })
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral");

    if (!candidato) {
      throw new Error(`Candidato con Id: ${id} no fue encontrado.`);
    }
    return res.status(200).json({ data: candidato });
  } catch (err) {
    console.log("error - getCandidato");
    next(err);
  }
};

const updateCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      throw new Error(`Candidato con Id: ${id} no fue encontrado.`);
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
    console.log("error - updateCandidato");
    next(err);
  }
};

const deleteCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const candidato = await Candidato.findOne({ idsec: id });
    if (!candidato) {
      throw new Error(`El candidato con Id: ${id} no fue encontrado`);
    }

    await Candidato.findByIdAndDelete(candidato._id);
    return res
      .status(200)
      .json({ message: "Candidato eliminado exitosamente." });
  } catch (err) {
    console.log("error - deleteCandidato");
    next(err);
  }
};

export {
  createCandidato,
  getAllCandidatos,
  getCandidato,
  updateCandidato,
  deleteCandidato,
};
