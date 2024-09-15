import { NextFunction, Request, Response } from "express";
import {
  Puesto,
  PuestoInput,
  PUESTO_ESTADOS,
  NIVEL_RIESGO,
} from "../models/puesto.model";
import { Idioma } from "../models/idioma.model";

const createPuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nombre,
      descripcion,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
      idioma: idiomaIdSec,
      estado,
    } = req.body;

    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }
    if (!nivelRiesgo || !Object.values(NIVEL_RIESGO).includes(nivelRiesgo)) {
      return res.status(422).json({
        message: "El campo Nivel de Riesgo es inválido o está vacío",
      });
    }
    if (nivelMinimoSalario === undefined || nivelMaximoSalario === undefined) {
      return res.status(422).json({
        message: "Los campos Nivel Mínimo y Máximo de Salario son requeridos",
      });
    }
    if (nivelMinimoSalario > nivelMaximoSalario) {
      return res.status(422).json({
        message:
          "El Nivel Mínimo de Salario no puede ser mayor que el Nivel Máximo de Salario",
      });
    }

    if (!idiomaIdSec) {
      return res.status(404).json({
        message: `El idioma con Id: ${idiomaIdSec} no pudo ser encontrado`,
      });
    }
    const idioma = await Idioma.findOne({ idsec: idiomaIdSec });

    const puestoInput: PuestoInput = {
      nombre,
      descripcion,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
      idioma: idioma?._id,
      estado: estado ?? PUESTO_ESTADOS.ACTIVO,
    };

    const puestoCreated = await Puesto.create(puestoInput);
    return res.status(201).json({ data: puestoCreated });
  } catch (err) {
    console.error("error - createPuesto");
    next(err);
  }
};

const getAllPuestos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idsec, nombre, nivelRiesgo, estado } = req.query;

    const filter: any = {};
    if (idsec) filter.idsec = idsec;
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (nivelRiesgo) {
      filter.nivelRiesgo = nivelRiesgo;
    }
    if (estado) {
      filter.estado = estado;
    }

    const puestos = await Puesto.find(filter)
      .populate("idioma")
      .sort("-idsec")
      .exec();
    return res.status(200).json({ data: puestos });
  } catch (err) {
    console.error("error - getAllPuestos");
    next(err);
  }
};

const getPuesto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findOne({ idsec: id }).populate("idioma");
    if (!puesto) {
      return res
        .status(404)
        .json({ message: `Puesto con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: puesto });
  } catch (err) {
    console.error("error - getPuesto");
    next(err);
  }
};

const updatePuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
      idioma: idiomaIdSec,
      estado,
    } = req.body;

    const puesto = await Puesto.findOne({ idsec: id });
    if (!puesto) {
      return res
        .status(404)
        .json({ message: `Puesto con Id: ${id} no fue encontrado.` });
    }
    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }
    if (nivelRiesgo && !Object.values(NIVEL_RIESGO).includes(nivelRiesgo)) {
      return res.status(422).json({
        message: "El campo Nivel de Riesgo es inválido",
      });
    }
    if (nivelMinimoSalario === undefined || nivelMaximoSalario === undefined) {
      return res.status(422).json({
        message: "Los campos Nivel Mínimo y Máximo de Salario son requeridos",
      });
    }
    if (nivelMinimoSalario > nivelMaximoSalario) {
      return res.status(422).json({
        message:
          "El Nivel Mínimo de Salario no puede ser mayor que el Nivel Máximo de Salario",
      });
    }
    if (!idiomaIdSec) {
      return res.status(404).json({
        message: `El idioma con Id: ${idiomaIdSec} no pudo ser encontrado`,
      });
    }
    const idioma = await Idioma.findOne({ idsec: idiomaIdSec });

    await Puesto.updateOne(
      { _id: puesto._id },
      {
        nombre,
        descripcion,
        nivelRiesgo,
        nivelMinimoSalario,
        nivelMaximoSalario,
        idioma: idioma?._id,
        estado,
      }
    );

    const puestoUpdated = await Puesto.findOne({ idsec: id }).populate(
      "idioma"
    );
    return res.status(200).json({ data: puestoUpdated });
  } catch (err) {
    console.error("error - updatePuesto");
    next(err);
  }
};

const deletePuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findOne({ idsec: id });
    if (!puesto) {
      return res
        .status(404)
        .json({ message: `Puesto con Id: ${id} no fue encontrado.` });
    }

    await Puesto.findByIdAndDelete(puesto._id);
    return res.status(200).json({ message: "Puesto eliminado exitosamente." });
  } catch (err) {
    console.error("error - deletePuesto");
    next(err);
  }
};

export { createPuesto, getAllPuestos, getPuesto, updatePuesto, deletePuesto };
