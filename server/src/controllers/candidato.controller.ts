import { NextFunction, Request, Response } from "express";
import { Candidato, CandidatoInput } from "../models/candidato.model";
import { Puesto } from "../models/puesto.model";
import { Competencia } from "../models/competencia.model";
import { Capacitacion } from "../models/capacitacion.model";
import { ExperienciaLaboral } from "../models/experienciaLaboral.model";

const createCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      cedula,
      nombre,
      puestoIdSec,
      departamento,
      salarioAspira,
      competenciaIdSecList,
      capacitacionIdSecList,
      experienciaLaboralIdSecList,
      recomendadoPor,
      user_name,
      estado,
    } = req.body;

    if (
      !cedula ||
      !nombre ||
      !puestoIdSec ||
      !departamento ||
      salarioAspira === undefined
    ) {
      throw new Error(
        "Los campos Cedula, Nombre, Puesto y Departamento son requeridos."
      );
    }

    const puesto = await Puesto.findOne({ idsec: puestoIdSec });
    if (!puesto) {
      throw new Error(`No se encontró un puesto con idsec ${puestoIdSec}`);
    }

    const competencias = await Competencia.find({
      idsec: { $in: competenciaIdSecList },
    });
    const competenciasIds = competencias.map((x) => x._id);

    const capacitaciones = await Capacitacion.find({
      idsec: { $in: capacitacionIdSecList },
    });
    const capacitacionesIds = capacitaciones.map((x) => x._id);

    const experencias = await ExperienciaLaboral.find({
      idsec: { $in: experienciaLaboralIdSecList },
    });
    const experenciasIds = experencias.map((x) => x._id);

    const candidatoInput: CandidatoInput = {
      cedula,
      nombre,
      puesto: puesto._id,
      departamento,
      salarioAspira,
      competencias: competenciasIds,
      capacitaciones: capacitacionesIds,
      experienciaLaboral: experenciasIds,
      recomendadoPor,
      user_name,
      estado,
    };

    const candidatoCreated = await Candidato.create(candidatoInput);
    return res.status(201).json({ data: candidatoCreated });
  } catch (err) {
    console.error("error - createCandidato");
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
      id,
      nombre,
      cedula,
      puestoIdSec,
      capacitacionIdSec,
      competenciaIdSec,
      departamento,
      salarioMin,
      salarioMax,
      user_name,
      estado,
    } = req.query;

    const filter: any = {};

    if (id) filter.idsec = id;
    if (nombre) filter.nombre = new RegExp(<string>nombre, "i");
    if (cedula) filter.cedula = new RegExp(<string>cedula, "i");
    if (departamento)
      filter.departamento = new RegExp(<string>departamento, "i");
    if (salarioMin || salarioMax) {
      filter.salarioAspira = {};
      if (salarioMin) filter.salarioAspira.$gte = salarioMin;
      if (salarioMax) filter.salarioAspira.$lte = salarioMax;
    }
    if (user_name) filter.user_name = user_name;
    if (estado) filter.estado = estado;

    if (puestoIdSec) {
      const puesto = await Puesto.findOne({ idsec: puestoIdSec });
      if (puesto) {
        filter.puesto = puesto._id;
      } else {
        return res
          .status(404)
          .json({ message: `Puesto con idsec ${puestoIdSec} no encontrado` });
      }
    }

    // Filtrar por capacitacionIdSec
    if (capacitacionIdSec) {
      const capacitacion = await Capacitacion.findOne({
        idsec: capacitacionIdSec,
      });
      if (capacitacion) {
        filter.capacitaciones = { $in: [capacitacion._id] };
      } else {
        return res
          .status(404)
          .json({
            message: `Capacitación con idsec ${capacitacionIdSec} no encontrada`,
          });
      }
    }

    // Filtrar por competenciaIdSec
    if (competenciaIdSec) {
      const competencia = await Competencia.findOne({
        idsec: competenciaIdSec,
      });
      if (competencia) {
        filter.competencias = { $in: [competencia._id] };
      } else {
        return res
          .status(404)
          .json({
            message: `Competencia con idsec ${competenciaIdSec} no encontrada`,
          });
      }
    }

    const candidatos = await Candidato.find(filter)
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: candidatos });
  } catch (err) {
    console.error("error - getAllCandidatos", err);
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
    console.error("error - getCandidato");
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
      puestoIdSec,
      departamento,
      salarioAspira,
      competenciaIdSecList,
      capacitacionIdSecList,
      experienciaLaboralIdSecList,
      recomendadoPor,
      estado,
    } = req.body;

    const candidato = await Candidato.findOne({ idsec: id });

    if (!candidato) {
      return res
        .status(404)
        .json({ message: `El candidato con Id: ${id} no fue encontrado` });
    }

    const puesto = await Puesto.findOne({ idsec: puestoIdSec });
    if (!puesto) {
      throw new Error(`No se encontró un puesto con idsec ${puestoIdSec}`);
    }

    const competencias = await Competencia.find({
      idsec: { $in: competenciaIdSecList },
    });
    const competenciaIds = competencias.map((competencia) => competencia._id);

    const capacitaciones = await Capacitacion.find({
      idsec: { $in: capacitacionIdSecList },
    });
    const capacitacionIds = capacitaciones.map(
      (capacitacion) => capacitacion._id
    );

    const experienciasLaborales = await ExperienciaLaboral.find({
      idsec: { $in: experienciaLaboralIdSecList },
    });
    const experienciaLaboralIds = experienciasLaborales.map(
      (experiencia) => experiencia._id
    );

    const updatedData: Partial<CandidatoInput> = {
      cedula,
      nombre,
      puesto: puesto._id,
      departamento,
      salarioAspira,
      competencias: competenciaIds,
      capacitaciones: capacitacionIds,
      experienciaLaboral: experienciaLaboralIds,
      recomendadoPor,
      estado,
    };

    await Candidato.updateOne({ idsec: id }, updatedData);
    const candidatoUpdated = await Candidato.findOne({ idsec: id })
      .populate("puesto")
      .populate("competencias")
      .populate("capacitaciones")
      .populate("experienciaLaboral");

    return res.status(200).json({ data: candidatoUpdated });
  } catch (err) {
    console.error("error - updateCandidato", err);
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
      return res
        .status(404)
        .json({ message: `El candidato con Id: ${id} no fue encontrado` });
    }

    await Candidato.findByIdAndDelete(candidato._id);
    return res
      .status(200)
      .json({ message: "Candidato eliminado exitosamente." });
  } catch (err) {
    console.error("error - deleteCandidato");
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
