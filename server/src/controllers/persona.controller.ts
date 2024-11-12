import { NextFunction, Request, Response } from "express";
import { Persona, PersonaInput } from "../models/persona.model";
import { EMAIL_REGEX, PHONE_REGEX, DOCUMENTO_REGEX } from "../lib/constants";

const createPersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, email, telefono, documento, direccion, estado } = req.body;

    if (!nombre || !email || !documento) {
      return res.status(422).json({
        message: "Los campos Nombre, Email y Documento son requeridos.",
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        message: "Debe proveer un email válido.",
      });
    }
    if (!DOCUMENTO_REGEX.test(documento)) {
      return res.status(422).json({
        message: "Debe proveer un documento válido en formato ###-#######-#.",
      });
    }
    if (telefono && !PHONE_REGEX.test(telefono)) {
      return res.status(422).json({
        message:
          "Debe proveer un teléfono válido en formato (###) ###-#### o ###-###-####.",
      });
    }

    const personaInput: PersonaInput = {
      nombre,
      email,
      telefono,
      documento,
      direccion,
      estado: estado ?? true,
    };

    const personaCreated = await Persona.create(personaInput);
    return res.status(201).json({ data: personaCreated });
  } catch (err) {
    console.error("Error - createPersona:", err);
    next(err);
  }
};

const getAllPersonas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, email, estado, documento } = req.query;

    const filter: any = {};
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (documento) {
      filter.nombre = { $regex: documento, $options: "i" };
    }
    if (estado) {
      filter.estado = estado;
    }

    const personas = await Persona.find(filter).sort("-createdAt").exec();
    return res.status(200).json({ data: personas });
  } catch (err) {
    console.error("Error - getAllPersonas:", err);
    next(err);
  }
};

const getPersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const persona = await Persona.findOne({ idsec: id });
    if (!persona) {
      return res
        .status(404)
        .json({ message: `Persona con Id: ${id} no fue encontrada.` });
    }
    return res.status(200).json({ data: persona });
  } catch (err) {
    console.error("Error - getPersona:", err);
    next(err);
  }
};

const updatePersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, documento, direccion, estado } = req.body;

    const persona = await Persona.findOne({ idsec: id });
    if (!persona) {
      return res
        .status(404)
        .json({ message: `Persona con Id: ${id} no fue encontrada.` });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        message: "Debe proveer un email válido.",
      });
    }
    if (documento && !DOCUMENTO_REGEX.test(documento)) {
      return res.status(422).json({
        message: "Debe proveer un documento válido en formato ###-#######-#.",
      });
    }
    if (telefono && !PHONE_REGEX.test(telefono)) {
      return res.status(422).json({
        message:
          "Debe proveer un teléfono válido en formato (###) ###-#### o ###-###-####.",
      });
    }

    await Persona.updateOne(
      { _id: persona._id },
      { nombre, email, telefono, documento, direccion, estado }
    );

    const personaUpdated = await Persona.findOne({ idsec: id });
    return res.status(200).json({ data: personaUpdated });
  } catch (err) {
    console.error("Error - updatePersona:", err);
    next(err);
  }
};

const deletePersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const persona = await Persona.findOne({ idsec: id });
    if (!persona) {
      return res
        .status(404)
        .json({ message: `Persona con Id: ${id} no fue encontrada.` });
    }

    await Persona.findByIdAndDelete(persona._id);
    return res.status(200).json({ message: "Persona eliminada exitosamente." });
  } catch (err) {
    console.error("Error - deletePersona:", err);
    next(err);
  }
};

export {
  createPersona,
  getAllPersonas,
  getPersona,
  updatePersona,
  deletePersona,
};
