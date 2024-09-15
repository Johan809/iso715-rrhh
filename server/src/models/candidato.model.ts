import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const CANDIDATO_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Cancelado",
  CONTRATADO: "C",
  CONTRATADO_LABEL: "Contratado",
  RECHAZADO: "R",
  RECHAZADO_LABEL: "Rechazado",
};

type CandidatoDocument = Document & {
  idsec: number;
  cedula: string;
  nombre: string;
  puesto: Schema.Types.ObjectId;
  departamento: string;
  salarioAspira: number;
  competencias: Schema.Types.ObjectId[];
  capacitaciones: Schema.Types.ObjectId[];
  experienciaLaboral: Schema.Types.ObjectId[];
  recomendadoPor: string;
  user_name: string;
  estado: string;
};

type CandidatoInput = {
  cedula: CandidatoDocument["cedula"];
  nombre: CandidatoDocument["nombre"];
  puesto: CandidatoDocument["puesto"];
  departamento: CandidatoDocument["departamento"];
  salarioAspira: CandidatoDocument["salarioAspira"];
  competencias: CandidatoDocument["competencias"];
  capacitaciones: CandidatoDocument["capacitaciones"];
  experienciaLaboral: CandidatoDocument["experienciaLaboral"];
  recomendadoPor: CandidatoDocument["recomendadoPor"];
  user_name: CandidatoDocument["user_name"];
  estado: CandidatoDocument["estado"];
};

const candidatoSchema = new Schema<CandidatoDocument>(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    cedula: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    nombre: {
      type: Schema.Types.String,
      required: true,
    },
    puesto: {
      type: Schema.Types.ObjectId,
      ref: "Puesto",
      required: true,
    },
    departamento: {
      type: Schema.Types.String,
      required: true,
    },
    salarioAspira: {
      type: Schema.Types.Number,
      required: true,
    },
    competencias: [
      {
        type: Schema.Types.ObjectId,
        ref: "Competencia",
      },
    ],
    capacitaciones: [
      {
        type: Schema.Types.ObjectId,
        ref: "Capacitacion",
      },
    ],
    experienciaLaboral: [
      {
        type: Schema.Types.ObjectId,
        ref: "ExperienciaLaboral",
      },
    ],
    recomendadoPor: {
      type: Schema.Types.String,
    },
    user_name: {
      type: Schema.Types.String,
    },
    estado: {
      type: Schema.Types.String,
      required: true,
      enum: CANDIDATO_ESTADOS,
    },
  },
  {
    collection: "candidatos",
    timestamps: true,
  }
);

candidatoSchema.pre("save", async function (next) {
  const doc = this as CandidatoDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "candidatoId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Candidato: Model<CandidatoDocument> = mongoose.model<CandidatoDocument>(
  "Candidato",
  candidatoSchema
);
export { Candidato, CandidatoInput, CandidatoDocument, CANDIDATO_ESTADOS };
