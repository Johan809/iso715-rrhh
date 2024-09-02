import { NextFunction, Request, Response } from "express";
import { Idioma, IDIOMA_ESTADOS, IdiomaInput } from "../models/idioma.model";

const createIdioma = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, estado } = req.body;

    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }

    const idiomaInput: IdiomaInput = {
      nombre,
      estado: estado ?? IDIOMA_ESTADOS.ACTIVO,
    };

    const idiomaCreated = await Idioma.create(idiomaInput);
    return res.status(201).json({ data: idiomaCreated });
  } catch (err) {
    console.log("error - createIdioma");
    next(err);
  }
};

const getAllIdiomas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, estado } = req.query;

    const filter: any = {};
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (estado) {
      filter.estado = estado;
    }

    const idiomas = await Idioma.find(filter).sort("-createdAt").exec();
    return res.status(200).json({ data: idiomas });
  } catch (err) {
    console.log("error - getAllIdiomas");
    next(err);
  }
};

const getIdioma = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const idioma = await Idioma.findOne({ idsec: id });
    if (!idioma) {
      return res
        .status(404)
        .json({ message: `Idioma con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: idioma });
  } catch (err) {
    console.log("error - getIdioma");
    next(err);
  }
};

const updateIdioma = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const idioma = await Idioma.findOne({ idsec: id });
    if (!idioma) {
      return res
        .status(404)
        .json({ message: `Idioma con Id: ${id} no fue encontrado.` });
    }
    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }

    await Idioma.updateOne({ _id: idioma._id }, { nombre, estado });
    const idiomaUpdated = await Idioma.findOne({ idsec: id });
    return res.status(200).json({ data: idiomaUpdated });
  } catch (err) {
    console.log("error - updateIdioma");
    next(err);
  }
};

const deleteIdioma = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const idioma = await Idioma.findOne({ idsec: id });
    if (!idioma) {
      return res
        .status(404)
        .json({ message: `Idioma con Id: ${id} no fue encontrado.` });
    }

    await Idioma.findById(idioma._id);
    return res.status(200).json({ message: "Idioma eliminado exitosamente." });
  } catch (err) {
    console.log("error - deleteIdioma");
    next(err);
  }
};

export { createIdioma, getAllIdiomas, getIdioma, updateIdioma, deleteIdioma };
