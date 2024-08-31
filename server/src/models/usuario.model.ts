import mongoose, { Schema, Model, Document } from "mongoose";
import { hash, compare, genSalt } from "bcryptjs";
import { Counter } from "./contador.schema";
import { RoleDocument } from "./role.model";
import { EMAIL_REGEX } from "../lib/constants";

const USUARIO_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
  BLOQUEADO: "B",
  BLOQUEADO_LABEL: "Bloqueado",
};

type UsuarioDocument = Document & {
  idsec: number;
  nombre: string;
  email: string;
  password: string;
  role?: mongoose.Types.ObjectId | RoleDocument | number; // Referencia a la colección 'roles'
  estado: boolean;
  comparePwd(enteredPwd: string): Promise<boolean>;
};

interface IUsuarioModel extends Model<UsuarioDocument> {
  hashPwd(pwd: string): Promise<string>;
}

type UsuarioInput = {
  nombre: UsuarioDocument["nombre"];
  email: UsuarioDocument["email"];
  password: UsuarioDocument["password"];
  role?: UsuarioDocument["role"];
  estado: UsuarioDocument["estado"];
};

const usuarioSchema = new Schema<UsuarioDocument, IUsuarioModel>(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    nombre: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      match: [EMAIL_REGEX, "Por favor ingrese un email válido."],
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minLenght: 6,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: false,
    },
    estado: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    collection: "usuarios",
    timestamps: true,
    statics: {
      async hashPwd(pwd: string): Promise<string> {
        const salt = await genSalt(10);
        const _hash = await hash(pwd, salt);
        return _hash;
      },
    },
  }
);

usuarioSchema.methods.comparePwd = async function (
  enteredPwd: string
): Promise<boolean> {
  const doc = this as UsuarioDocument;
  return await compare(enteredPwd, doc.password);
};

usuarioSchema.pre("save", async function (next) {
  const doc = this as UsuarioDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "usuarioId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Usuario = mongoose.model<UsuarioDocument, IUsuarioModel>(
  "Usuario",
  usuarioSchema
);
export { Usuario, UsuarioInput, UsuarioDocument, USUARIO_ESTADOS };
