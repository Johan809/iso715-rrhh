import { Request, Response } from "express";
import {
  Puesto,
  PuestoInput,
  PUESTO_ESTADOS,
  NIVEL_RIESGO,
} from "../models/puesto.model";

const createPuesto = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
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

    const puestoInput: PuestoInput = {
      nombre,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
      estado: estado ?? PUESTO_ESTADOS.ACTIVO,
    };

    const puestoCreated = await Puesto.create(puestoInput);
    return res.status(201).json({ data: puestoCreated });
  } catch (err) {
    console.error("createPuesto", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const getAllPuestos = async (req: Request, res: Response) => {
  try {
    const { nombre, nivelRiesgo, estado } = req.query;

    const filter: any = {};
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (nivelRiesgo) {
      filter.nivelRiesgo = nivelRiesgo;
    }
    if (estado) {
      filter.estado = estado;
    }

    const puestos = await Puesto.find(filter).sort("-createdAt").exec();
    return res.status(200).json({ data: puestos });
  } catch (err) {
    console.error("getAllPuestos", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const getPuesto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const puesto = await Puesto.findOne({ idsec: id });
    if (!puesto) {
      return res
        .status(404)
        .json({ message: `Puesto con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: puesto });
  } catch (err) {
    console.error("getPuesto", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const updatePuesto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      nivelRiesgo,
      nivelMinimoSalario,
      nivelMaximoSalario,
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

    await Puesto.updateOne(
      { _id: puesto._id },
      { nombre, nivelRiesgo, nivelMinimoSalario, nivelMaximoSalario, estado }
    );

    const puestoUpdated = await Puesto.findOne({ idsec: id });
    return res.status(200).json({ data: puestoUpdated });
  } catch (err) {
    console.error("updatePuesto", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const deletePuesto = async (req: Request, res: Response) => {
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
    console.error("deletePuesto", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

export { createPuesto, getAllPuestos, getPuesto, updatePuesto, deletePuesto };
