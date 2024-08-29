import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";
import { RoleDocument } from "./role.model";

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
  role: mongoose.Types.ObjectId | RoleDocument | number; // Referencia a la colección 'roles'
  estado: boolean;
};

type UsuarioInput = {
  nombre: UsuarioDocument["nombre"];
  email: UsuarioDocument["email"];
  password: UsuarioDocument["password"];
  role: UsuarioDocument["role"];
  estado: UsuarioDocument["estado"];
};

const usuarioSchema = new Schema(
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
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },
    estado: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    collection: "usuarios",
    timestamps: true,
  }
);

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

const Usuario: Model<UsuarioDocument> = mongoose.model<UsuarioDocument>(
  "Usuario",
  usuarioSchema
);
export { Usuario, UsuarioInput, UsuarioDocument, USUARIO_ESTADOS };
