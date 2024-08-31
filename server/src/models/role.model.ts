import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const ROLE_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

type RoleDocument = Document & {
  idsec: Number;
  nombre: string;
  estado: string;
  nivel: number;
};

type RoleInput = {
  nombre: RoleDocument["nombre"];
  estado: RoleDocument["estado"];
  nivel: RoleDocument["nivel"];
};

const rolSchema = new Schema(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    nombre: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    nivel: {
      type: Schema.Types.Number,
      required: true,
    },
    estado: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: "roles",
    timestamps: true,
  }
);

rolSchema.pre("save", async function (next) {
  const doc = this as RoleDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "roleId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Role: Model<RoleDocument> = mongoose.model<RoleDocument>(
  "Role",
  rolSchema
);
export { Role, RoleInput, RoleDocument, ROLE_ESTADOS };
