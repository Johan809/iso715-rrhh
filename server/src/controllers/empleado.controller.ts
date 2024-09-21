import { NextFunction, Request, Response } from "express";
import {
  Empleado,
  EMPLEADO_ESTADOS,
  EmpleadoInput,
} from "../models/empleado.model";
import {
  Candidato,
  CANDIDATO_ESTADOS,
  CandidatoDocument,
} from "../models/candidato.model";
import { Puesto } from "../models/puesto.model";

const createEmpleado = async (
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
      salarioMensual,
      fechaIngreso,
      estado,
    } = req.body;

    if (
      !cedula ||
      !nombre ||
      !puestoIdSec ||
      !departamento ||
      salarioMensual === undefined ||
      !fechaIngreso
    ) {
      return res.status(422).json({
        message:
          "Los campos Cedula, Nombre, Puesto, Departamento, Salario Mensual y Fecha de Ingreso son requeridos.",
      });
    }

    const puesto = await Puesto.findOne({ idsec: puestoIdSec });

    const empleadoInput: EmpleadoInput = {
      cedula,
      nombre,
      puesto: puesto?._id,
      departamento,
      salarioMensual,
      fechaIngreso,
      estado: estado ?? EMPLEADO_ESTADOS.ACTIVO,
    };

    const empleadoCreated = await Empleado.create(empleadoInput);
    return res.status(201).json({ data: empleadoCreated });
  } catch (err) {
    console.error("error - createEmpleado");
    next(err);
  }
};

const getAllEmpleados = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nombre,
      cedula,
      puestoIdSec,
      departamento,
      estado,
      fechaInicio,
      fechaFin,
    } = req.query;

    const filter: any = {};
    if (nombre) filter.nombre = new RegExp(nombre as string, "i");
    if (cedula) filter.cedula = new RegExp(<string>cedula, "i");
    if (departamento) filter.departamento = departamento;
    if (estado) filter.estado = estado;

    if (fechaInicio) {
      filter.fechaIngreso = { $gte: new Date(fechaInicio as string) };
    }
    if (fechaFin) {
      filter.fechaIngreso = { $lte: new Date(fechaFin as string) };
    }

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

    const empleados = await Empleado.find(filter)
      .populate("puesto")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: empleados });
  } catch (err) {
    console.error("error - getAllEmpleados");
    next(err);
  }
};

const getEmpleado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findOne({ idsec: id }).populate("puesto");

    if (!empleado) {
      return res
        .status(404)
        .json({ message: `Empleado con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: empleado });
  } catch (err) {
    console.error("error - getEmpleado");
    next(err);
  }
};

const updateEmpleado = async (
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
      salarioMensual,
      fechaIngreso,
      estado,
    } = req.body;

    const empleado = await Empleado.findOne({ idsec: id });

    if (!empleado) {
      return res
        .status(404)
        .json({ message: `Empleado con Id: ${id} no fue encontrado.` });
    }

    const puesto = await Puesto.findOne({ idsec: puestoIdSec });

    const updatedData: Partial<EmpleadoInput> = {
      cedula,
      nombre,
      puesto: puesto?._id,
      departamento,
      salarioMensual,
      fechaIngreso,
      estado,
    };

    await Empleado.updateOne({ idsec: id }, updatedData);
    const empleadoUpdated = await Empleado.findOne({ idsec: id }).populate(
      "puesto"
    );

    return res.status(200).json({ data: empleadoUpdated });
  } catch (err) {
    console.error("error - updateEmpleado");
    next(err);
  }
};

const deleteEmpleado = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findOne({ idsec: id });
    if (!empleado) {
      return res
        .status(404)
        .json({ message: `Empleado con Id: ${id} no fue encontrado.` });
    }

    await Empleado.findByIdAndDelete(empleado._id);
    return res
      .status(200)
      .json({ message: "Empleado eliminado exitosamente." });
  } catch (err) {
    console.error("error - deleteEmpleado");
    next(err);
  }
};

const createEmpleadoFromCandidato = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { fechaIngreso, departamento, salario } = req.body;

    const candidato: CandidatoDocument | null = await Candidato.findOne({
      idsec: id,
    }).populate("puesto");

    if (!candidato) {
      return res
        .status(404)
        .json({ message: `Candidato con Id: ${id} no fue encontrado.` });
    }

    const empleadoInput: EmpleadoInput = {
      cedula: candidato.cedula,
      nombre: candidato.nombre,
      fechaIngreso: fechaIngreso ?? new Date(),
      departamento: departamento ?? candidato.departamento,
      puesto: candidato.puesto,
      salarioMensual: salario ?? candidato.salarioAspira,
      estado: EMPLEADO_ESTADOS.ACTIVO,
    };

    const empleadoCreated = await Empleado.create(empleadoInput);
    await Candidato.updateOne(
      { idsec: id },
      {
        estado: CANDIDATO_ESTADOS.CONTRATADO,
      }
    );

    return res.status(201).json({ data: empleadoCreated });
  } catch (err) {
    console.error("error - createEmpleadoFromCandidato");
    next(err);
  }
};

export {
  createEmpleado,
  getAllEmpleados,
  getEmpleado,
  updateEmpleado,
  deleteEmpleado,
  createEmpleadoFromCandidato,
};
