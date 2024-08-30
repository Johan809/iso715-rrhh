import { Request, Response } from "express";
import { Idioma, IDIOMA_ESTADOS, IdiomaInput } from "../models/idioma.model";

const createIdioma = async (req: Request, res: Response) => {
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
    console.error("createIdioma", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getAllIdiomas = async (req: Request, res: Response) => {
  try {
    const { nombre, estado } = req.query;

    const filter: any = {};
    if (nombre) {
      // Filtro por nombre, insensible a mayúsculas/minúsculas
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (estado) {
      // Filtro por estado
      filter.estado = estado;
    }

    const idiomas = await Idioma.find(filter).sort("-createdAt").exec();
    return res.status(200).json({ data: idiomas });
  } catch (err) {
    console.error("getAllIdiomas", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getIdioma = async (req: Request, res: Response) => {
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
    console.error("getIdioma", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const updateIdioma = async (req: Request, res: Response) => {
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
    console.error("updateIdioma", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const deleteIdioma = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Idioma.findOneAndDelete({ idsec: id });

    return res.status(200).json({ message: "Idioma eliminado exitosamente." });
  } catch (err) {
    console.error("deleteIdioma", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

export { createIdioma, getAllIdiomas, getIdioma, updateIdioma, deleteIdioma };
