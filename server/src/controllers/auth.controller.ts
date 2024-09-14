import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { EMAIL_REGEX, NIVEL_ROLES } from "../lib/constants";
import { Role, RoleDocument } from "../models/role.model";
import {
  Usuario,
  UsuarioDocument,
  UsuarioInput,
} from "../models/usuario.model";

const getToken = (user: UsuarioDocument): string => {
  return jwt.sign(
    {
      id: user.idsec,
      email: user.email,
      role: (<RoleDocument>user?.role).nivel,
    },
    <string>process.env.JWT_SECRET
  );
};

const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    let { email } = req.body;
    email = (<string>email).toLowerCase();

    if (!username) {
      return res.status(422).send({
        statusCode: 422,
        message:
          "Debe proporcionar un nombre de usuario para crear una cuenta.",
      });
    } else if (!email) {
      return res.status(422).send({
        statusCode: 422,
        message:
          "Debe proporcionar una dirección de correo electrónico para crear una cuenta.",
      });
    } else if (!password) {
      return res.status(422).send({
        statusCode: 422,
        message: "Debe proporcionar una contraseña para crear una cuenta.",
      });
    }

    const checkUsername = await Usuario.findOne({ nombre: username });
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
    if (!EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        message: "Por favor ingrese un email válido.",
      });
    }

    //el nivel 1 es el nivel menor, por defecto para los usuarios
    const role = await Role.findOne({ nivel: NIVEL_ROLES.USUARIO });
    const hashedPwd = await Usuario.hashPwd(password);

    const usuarioInput: UsuarioInput = {
      nombre: username,
      email,
      estado: true,
      password: hashedPwd,
      role: role?._id,
    };

    const registerUser = await Usuario.create(usuarioInput);
    const user = (await Usuario.findById(registerUser._id).populate(
      "role"
    )) as UsuarioDocument;
    const token = getToken(user);

    return res.status(200).json({
      message: "Usuario registrado exitosamente.",
      token,
      data: {
        username: user.nombre,
        email: user.email,
        role: (<RoleDocument>user.role).nivel,
        estado: user.estado,
      },
    });
  } catch (err) {
    console.error("register", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    let { email } = req.body;
    email = (<string>email).toLowerCase();

    if (!email) {
      return res.status(400).send({
        statusCode: 400,
        message:
          "Debe proporcionar una dirección de correo electrónico para iniciar sesión.",
      });
    } else if (!password) {
      return res.status(400).send({
        statusCode: 400,
        message: "Debe proporcionar una contraseña para iniciar sesión.",
      });
    }

    const user = await Usuario.findOne({ email }).populate("role");
    if (!user) {
      return res.status(404).send({
        message:
          "Usuario no encontrado. Revise su correo electrónico o nombre de usuario y vuelva a intentarlo. Si no tienes una cuenta, regístrate.",
      });
    }

    const isPwdValid = await user?.comparePwd(password);
    if (!isPwdValid) {
      return res.status(401).send({
        message:
          "Credenciales no válidas. Ingrese un correo electrónico válido o un nombre de usuario y contraseña.",
      });
    }

    const token = getToken(user);
    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      data: {
        username: user?.nombre,
        email: user?.email,
        role: (<RoleDocument>user?.role).nivel,
        estado: user.estado,
      },
    });
  } catch (err) {
    console.error("login", err);
    return res.status(500).json({ message: "Server Error", Exception: err });
  }
};

export { login, register };
