import { NextFunction, Request, Response } from "express";
import { Usuario, UsuarioInput } from "../models/usuario.model";
import { Role } from "../models/role.model";
import { EMAIL_REGEX } from "../lib/constants";

const createUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, password, role_id, estado } = req.body;
    let { email } = req.body;
    email = (<string>email).toLowerCase();

    if (!nombre || !email || !password || !role_id) {
      return res.status(422).json({
        message: "Los campos Nombre, Email, Contraseña y Rol son requeridos",
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        message: "Debe proveer un email válido.",
      });
    }

    const checkUsername = await Usuario.findOne({ nombre });
    const checkEmail = await Usuario.findOne({ email });
    if (checkUsername) {
      return res.status(409).send({
        statusCode: 409,
        message: "Este nombre de usuario no esta disponible.",
      });
    } else if (checkEmail) {
      return res.status(409).send({
        statusCode: 409,
        message: "Esta dirección de correo electrónico ya está en uso.",
      });
    }

    // Buscar el Role según el idsec
    const role = await Role.findOne({ idsec: role_id });
    if (!role) {
      return res.status(404).json({
        message: `Rol con Id: ${role_id} no fue encontrado.`,
      });
    }

    const hashedPwd = await Usuario.hashPwd(password);
    const usuarioInput: UsuarioInput = {
      nombre,
      email,
      password: hashedPwd,
      role: role._id, // Asignar el ObjectId del Role encontrado
      estado: estado ?? true,
    };

    const usuarioCreated = await Usuario.create(usuarioInput);
    const user = await Usuario.findById(usuarioCreated._id)
      .select("-password")
      .populate("role");
    return res.status(201).json({ data: user });
  } catch (err) {
    console.error("error - createUsuario");
    next(err);
  }
};

const getAllUsuarios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, email, estado, roleIdSec } = req.query;

    const filter: any = {};
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (estado) {
      filter.estado = estado;
    }
    if (roleIdSec) {
      const role = await Role.findOne({ idsec: roleIdSec });
      filter.role = role?._id;
    }

    const usuarios = await Usuario.find(filter)
      .select("-password")
      .populate("role")
      .sort("-createdAt")
      .exec();

    return res.status(200).json({ data: usuarios });
  } catch (err) {
    console.error("error - getAllUsuarios");
    next(err);
  }
};

const getUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Popula el campo role
    const usuario = await Usuario.findOne({ idsec: id })
      .select("-password")
      .populate("role");
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con Id: ${id} no fue encontrado.` });
    }
    return res.status(200).json({ data: usuario });
  } catch (err) {
    console.error("error - getUsuario");
    next(err);
  }
};

const updateUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { nombre, role_id, estado } = req.body;

    // Buscar el usuario
    const usuario = await Usuario.findOne({ idsec: id });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con Id: ${id} no fue encontrado.` });
    }

    // Buscar el Role si se envió un nuevo role_id
    let role;
    if (role_id) {
      role = await Role.findOne({ idsec: role_id });
      if (!role) {
        return res
          .status(404)
          .json({ message: `Role con Id: ${role_id} no fue encontrado.` });
      }
    }

    // Actualizar el usuario
    await Usuario.updateOne(
      { _id: usuario._id },
      {
        nombre,
        role: role ? role._id : usuario.role,
        estado,
      }
    );

    const usuarioUpdated = await Usuario.findOne({ idsec: id }).populate(
      "role"
    );
    return res.status(200).json({ data: usuarioUpdated });
  } catch (err) {
    console.error("error - updateUsuario");
    next(err);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Buscar el usuario
    const usuario = await Usuario.findOne({ idsec: id });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: `Usuario con Id: ${id} no fue encontrado.` });
    }

    // Comparar la contraseña antigua usando el método comparePwd
    const isPwdValid = await usuario.comparePwd(oldPassword);
    if (!isPwdValid) {
      return res
        .status(400)
        .json({ message: "La contraseña antigua no es correcta." });
    }

    // Encriptar la nueva contraseña
    const hashedPwd = await Usuario.hashPwd(newPassword);

    // Actualizar la contraseña del usuario
    await Usuario.updateOne({ _id: usuario._id }, { password: hashedPwd });

    return res
      .status(200)
      .json({ message: "Contraseña actualizada con éxito." });
  } catch (err) {
    console.error("Error - updatePassword:", err);
    next(err);
  }
};

const deleteUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findOne({ idsec: id });
    if (!user) {
      return res
        .status(404)
        .json({ message: `Usuario con Id: ${id} no fue encontrado.` });
    }

    await Usuario.findByIdAndDelete(user._id);
    return res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (err) {
    console.error("error - deleteUsuario");
    next(err);
  }
};

export {
  createUsuario,
  getAllUsuarios,
  getUsuario,
  updateUsuario,
  updatePassword,
  deleteUsuario,
};
