import { NextFunction, Request, Response } from "express";
import { Role, ROLE_ESTADOS, RoleInput } from "../models/role.model";

const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, nivel, estado } = req.body;

    if (!nombre || !nivel) {
      return res.status(422).json({
        message: "El campo Nombre y Nivel son requeridos",
      });
    }

    const RoleInput: RoleInput = {
      nombre,
      nivel,
      estado: estado ?? ROLE_ESTADOS.ACTIVO,
    };

    const RoleCreated = await Role.create(RoleInput);
    return res.status(201).json({ data: RoleCreated });
  } catch (err) {
    console.error("error - createRole");
    next(err);
  }
};

const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, estado, nivel } = req.query;

    const filter: any = {};
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (estado) {
      filter.estado = estado;
    }
    if (nivel) {
      filter.nivel = nivel;
    }

    const roles = await Role.find(filter).sort("-createdAt").exec();
    return res.status(200).json({ data: roles });
  } catch (err) {
    console.error("error - getAllRoles");
    next(err);
  }
};

const getRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({ idsec: id });
    if (!role) {
      return res
        .status(404)
        .json({ message: `Rol con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: role });
  } catch (err) {
    console.error("error - getRole");
    next(err);
  }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, estado, nivel } = req.body;

    const role = await Role.findOne({ idsec: id });
    if (!role) {
      return res
        .status(404)
        .json({ message: `Rol con Id: ${id} no fue encontrado.` });
    }
    if (!nombre || !nivel) {
      return res.status(422).json({
        message: "Los campos Nombre y Nivel son requeridos",
      });
    }

    await Role.updateOne({ _id: role._id }, { nombre, estado, nivel });
    const roleUpdated = await Role.findOne({ idsec: id });
    return res.status(200).json({ data: roleUpdated });
  } catch (err) {
    console.error("error - updateRole");
    next(err);
  }
};

const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const roleToDelete = await Role.findOne({ idsec: id });
    if (!roleToDelete) {
      return res
        .status(404)
        .json({ message: `Rol con Id: ${id} no fue encontrado.` });
    }

    await Role.findOneAndDelete({ idsec: id });
    return res.status(200).json({ message: "Rol eliminado exitosamente." });
  } catch (err) {
    console.error("error - deleteRole");
    next(err);
  }
};

export { createRole, getAllRole, getRole, updateRole, deleteRole };
