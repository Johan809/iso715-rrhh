import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const PUESTO_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

const NIVEL_RIESGO = {
  ALTO: "ALTO",
  MEDIO: "MEDIO",
  BAJO: "BAJO",
};

type PuestoDocument = Document & {
  idsec: number;
  nombre: string;
  nivelRiesgo: string;
  nivelMinimoSalario: number;
  nivelMaximoSalario: number;
  estado: string;
};

type PuestoInput = {
  nombre: PuestoDocument["nombre"];
  nivelRiesgo: PuestoDocument["nivelRiesgo"];
  nivelMinimoSalario: PuestoDocument["nivelMinimoSalario"];
  nivelMaximoSalario: PuestoDocument["nivelMaximoSalario"];
  estado: PuestoDocument["estado"];
};

const puestoSchema = new Schema(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    nombre: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    nivelRiesgo: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(NIVEL_RIESGO),
    },
    nivelMinimoSalario: {
      type: Schema.Types.Number,
      required: true,
    },
    nivelMaximoSalario: {
      type: Schema.Types.Number,
      required: true,
    },
    estado: {
      type: Schema.Types.String,
      required: true,
      enum: [PUESTO_ESTADOS.ACTIVO, PUESTO_ESTADOS.INACTIVO],
    },
  },
  {
    collection: "puestos",
    timestamps: true,
  }
);

puestoSchema.pre("save", async function (next) {
  const doc = this as PuestoDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "puestoId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Puesto: Model<PuestoDocument> = mongoose.model<PuestoDocument>(
  "Puesto",
  puestoSchema
);
export { Puesto, PuestoInput, PuestoDocument, PUESTO_ESTADOS, NIVEL_RIESGO };
