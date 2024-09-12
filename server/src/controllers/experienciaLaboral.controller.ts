import { NextFunction, Request, Response } from "express";
import {
  ExperienciaLaboral,
  ExperienciaLaboralInput,
} from "../models/experienciaLaboral.model";

const createExperienciaLaboral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      empresa,
      puestoOcupado,
      fechaDesde,
      fechaHasta,
      salario,
      user_name,
    } = req.body;

    if (
      !empresa ||
      !puestoOcupado ||
      !fechaDesde ||
      !fechaHasta ||
      salario === undefined
    ) {
      return res.status(422).json({
        message: "Todos los campos son requeridos.",
      });
    }

    const experienciaInput: ExperienciaLaboralInput = {
      empresa,
      puestoOcupado,
      fechaDesde,
      fechaHasta,
      salario,
      user_name,
    };

    const experienciaLaboralCreated = await ExperienciaLaboral.create(
      experienciaInput
    );
    return res.status(201).json({ data: experienciaLaboralCreated });
  } catch (err) {
    console.error("error - createExperienciaLaboral");
    next(err);
  }
};

const getAllExperienciasLaborales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      empresa,
      puestoOcupado,
      fechaDesde,
      fechaHasta,
      salarioMin,
      salarioMax,
      user_name,
    } = req.query;

    const query: any = {};
    if (empresa) {
      query.empresa = new RegExp(empresa as string, "i");
    }
    if (puestoOcupado) {
      query.puestoOcupado = new RegExp(puestoOcupado as string, "i");
    }
    if (fechaDesde) {
      query.fechaDesde = { $gte: new Date(fechaDesde as string) };
    }
    if (fechaHasta) {
      query.fechaHasta = { $lte: new Date(fechaHasta as string) };
    }
    if (user_name) {
      query.user_name = user_name;
    }

    if (salarioMin || salarioMax) {
      query.salario = {};
      if (salarioMin) query.salario.$gte = Number(salarioMin);
      if (salarioMax) query.salario.$lte = Number(salarioMax);
    }

    const experienciasLaborales = await ExperienciaLaboral.find(query)
      .sort("-createdAt")
      .exec();
    return res.status(200).json({ data: experienciasLaborales });
  } catch (err) {
    console.error("getAllExperienciasLaborales");
    next(err);
  }
};

const getExperienciaLaboral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const experienciaLaboral = await ExperienciaLaboral.findOne({ idsec: id });

    if (!experienciaLaboral) {
      return res.status(404).json({
        message: `Experiencia Laboral con Id: ${id} no fue encontrada.`,
      });
    }

    return res.status(200).json({ data: experienciaLaboral });
  } catch (err) {
    console.error("error - getExperienciaLaboral");
    next(err);
  }
};

const updateExperienciaLaboral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      empresa,
      puestoOcupado,
      fechaDesde,
      fechaHasta,
      salario,
      user_name,
    } = req.body;

    const experienciaLaboral = await ExperienciaLaboral.findOne({ idsec: id });

    if (!experienciaLaboral) {
      return res.status(404).json({
        message: `Experiencia Laboral con Id: ${id} no fue encontrada.`,
      });
    }

    await ExperienciaLaboral.updateOne(
      { _id: experienciaLaboral._id },
      { empresa, puestoOcupado, fechaDesde, fechaHasta, salario, user_name }
    );

    const experienciaLaboralUpdated = await ExperienciaLaboral.findOne({
      idsec: id,
    });
    return res.status(200).json({ data: experienciaLaboralUpdated });
  } catch (err) {
    console.error("error - updateExperienciaLaboral");
    next(err);
  }
};

const deleteExperienciaLaboral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const experiencia = await ExperienciaLaboral.findOne({ idsec: id });
    if (!experiencia) {
      return res.status(404).json({
        message: `Experiencia Laboral con Id: ${id} no fue encontrada.`,
      });
    }

    await ExperienciaLaboral.findByIdAndDelete(experiencia._id);
    return res
      .status(200)
      .json({ message: "Experiencia Laboral eliminada exitosamente." });
  } catch (err) {
    console.error("error - deleteExperienciaLaboral");
    next(err);
  }
};

export {
  createExperienciaLaboral,
  getAllExperienciasLaborales,
  getExperienciaLaboral,
  updateExperienciaLaboral,
  deleteExperienciaLaboral,
};
