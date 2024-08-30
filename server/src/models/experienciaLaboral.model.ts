import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

type ExperienciaLaboralDocument = Document & {
  idsec: number;
  empresa: string;
  puestoOcupado: string;
  fechaDesde: Date;
  fechaHasta: Date;
  salario: number;
};

type ExperienciaLaboralInput = {
  empresa: ExperienciaLaboralDocument["empresa"];
  puestoOcupado: ExperienciaLaboralDocument["puestoOcupado"];
  fechaDesde: ExperienciaLaboralDocument["fechaDesde"];
  fechaHasta: ExperienciaLaboralDocument["fechaHasta"];
  salario: ExperienciaLaboralDocument["salario"];
};

const experienciaLaboralSchema = new Schema(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    empresa: {
      type: Schema.Types.String,
      required: true,
    },
    puestoOcupado: {
      type: Schema.Types.String,
      required: true,
    },
    fechaDesde: {
      type: Schema.Types.Date,
      required: true,
    },
    fechaHasta: {
      type: Schema.Types.Date,
      required: true,
    },
    salario: {
      type: Schema.Types.Number,
    },
  },
  {
    collection: "experienciasLaborales",
    timestamps: true,
  }
);

experienciaLaboralSchema.pre("save", async function (next) {
  const doc = this as ExperienciaLaboralDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "experienciaId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const ExperienciaLaboral: Model<ExperienciaLaboralDocument> =
  mongoose.model<ExperienciaLaboralDocument>(
    "ExperienciaLaboral",
    experienciaLaboralSchema
  );
export {
  ExperienciaLaboral,
  ExperienciaLaboralInput,
  ExperienciaLaboralDocument,
};
