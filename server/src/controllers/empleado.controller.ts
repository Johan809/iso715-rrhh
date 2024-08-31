import { Request, Response } from "express";
import {
  Empleado,
  EMPLEADO_ESTADOS,
  EmpleadoInput,
} from "../models/empleado.model";
import { Candidato, CandidatoDocument } from "../models/candidato.model";

const createEmpleado = async (req: Request, res: Response) => {
  try {
    const {
      cedula,
      nombre,
      puesto,
      departamento,
      salarioMensual,
      fechaIngreso,
      estado,
    } = req.body;

    if (
      !cedula ||
      !nombre ||
      !puesto ||
      !departamento ||
      salarioMensual === undefined ||
      !fechaIngreso
    ) {
      return res.status(422).json({
        message:
          "Los campos Cedula, Nombre, Puesto, Departamento, Salario Mensual y Fecha de Ingreso son requeridos.",
      });
    }

    const empleadoInput: EmpleadoInput = {
      cedula,
      nombre,
      puesto,
      departamento,
      salarioMensual,
      fechaIngreso,
      estado: estado ?? EMPLEADO_ESTADOS.ACTIVO,
    };

    const empleadoCreated = await Empleado.create(empleadoInput);
    return res.status(201).json({ data: empleadoCreated });
  } catch (err) {
    console.error("createEmpleado", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getAllEmpleados = async (req: Request, res: Response) => {
  try {
    const { nombre, puesto, departamento, estado } = req.query;

    const filter: any = {};
    if (nombre) filter.nombre = new RegExp(nombre as string, "i");
    if (puesto) filter.puesto = puesto;
    if (departamento) filter.departamento = departamento;
    if (estado) filter.estado = estado;

    const empleados = await Empleado.find(filter)
      .populate("puesto")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: empleados });
  } catch (err) {
    console.error("getAllEmpleados", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getEmpleado = async (req: Request, res: Response) => {
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
    console.error("getEmpleado", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const updateEmpleado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      puesto,
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

    const updatedData: Partial<EmpleadoInput> = {
      cedula,
      nombre,
      puesto,
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
    console.error("updateEmpleado", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const deleteEmpleado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Empleado.findOneAndDelete({ idsec: id });

    return res
      .status(200)
      .json({ message: "Empleado eliminado exitosamente." });
  } catch (err) {
    console.error("deleteEmpleado", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const createEmpleadoFromCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
      fechaIngreso: new Date(),
      departamento: candidato.departamento,
      puesto: candidato.puesto,
      salarioMensual: candidato.salarioAspira,
      estado: EMPLEADO_ESTADOS.ACTIVO,
    };

    const empleadoCreated = await Empleado.create(empleadoInput);
    await Candidato.deleteOne({ idsec: id });

    return res.status(201).json({ data: empleadoCreated });
  } catch (err) {
    console.error("createEmpleadoFromCandidato", err);
    return res.status(500).json({ message: "Server Error", exc: err });
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
