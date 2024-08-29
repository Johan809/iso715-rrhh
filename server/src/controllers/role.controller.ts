import { Request, Response } from "express";
import { Role, ROLE_ESTADOS, RoleInput } from "../models/role.model";

const createRole = async (req: Request, res: Response) => {
  try {
    const { nombre, estado } = req.body;

    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }

    const RoleInput: RoleInput = {
      nombre,
      estado: estado ?? ROLE_ESTADOS.ACTIVO,
    };

    const RoleCreated = await Role.create(RoleInput);
    return res.status(201).json({ data: RoleCreated });
  } catch (err) {
    console.error("createRole", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getAllRole = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().sort("-createdAt").exec();
    return res.status(200).json({ data: roles });
  } catch (err) {
    console.error("getAllIdiomas", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const getRole = async (req: Request, res: Response) => {
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
    console.error("getRole", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const role = await Role.findOne({ idsec: id });
    if (!role) {
      return res
        .status(404)
        .json({ message: `Rol con Id: ${id} no fue encontrado.` });
    }
    if (!nombre) {
      return res.status(422).json({
        message: "El campo Nombre es requerido",
      });
    }

    await Role.updateOne({ _id: role._id }, { nombre, estado });
    const roleUpdated = await Role.findOne({ idsec: id });
    return res.status(200).json({ data: roleUpdated });
  } catch (err) {
    console.error("updateRole", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Role.findOneAndDelete({ idsec: id });
    return res.status(200).json({ message: "Rol eliminado exitosamente." });
  } catch (err) {
    console.error("deleteRole", err);
    return res.status(500).json({ message: "Server Error", exc: err });
  }
};

export { createRole, getAllRole, getRole, updateRole, deleteRole };
