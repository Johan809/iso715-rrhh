import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const NIVEL_LIST = {
  GRADO: "G",
  GRADO_LABEL: "Grado",
  POSTGRADO: "P",
  POSTGRADO_LABEL: "Post-grado",
  MAESTRIA: "M",
  MAESTRIA_LABEL: "Maestría",
  DOCTORADO: "D",
  DOCTORADO_LABEL: "Doctorado",
  TECNICO: "T",
  TECNICO_LABEL: "Técnico",
  GESTION: "N",
  GESTION_LABEL: "Gestión",
};

type CapacitacionDocument = Document & {
  idsec: number;
  descripcion: string;
  nivel: string;
  fechaDesde: Date;
  fechaHasta: Date;
  institucion: string;
};

type CapacitacionInput = {
  descripcion: CapacitacionDocument["descripcion"];
  nivel: CapacitacionDocument["nivel"];
  fechaDesde: CapacitacionDocument["fechaDesde"];
  fechaHasta: CapacitacionDocument["fechaHasta"];
  institucion: CapacitacionDocument["institucion"];
};

const capacitacionSchema = new Schema(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    descripcion: {
      type: Schema.Types.String,
      required: true,
    },
    nivel: {
      type: Schema.Types.String,
      required: true,
      enum: [
        NIVEL_LIST.GRADO,
        NIVEL_LIST.POSTGRADO,
        NIVEL_LIST.MAESTRIA,
        NIVEL_LIST.DOCTORADO,
        NIVEL_LIST.TECNICO,
        NIVEL_LIST.GESTION,
      ],
    },
    fechaDesde: {
      type: Schema.Types.Date,
      required: true,
    },
    fechaHasta: {
      type: Schema.Types.Date,
      required: true,
    },
    institucion: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: "capacitaciones",
    timestamps: true,
  }
);

capacitacionSchema.pre("save", async function (next) {
  const doc = this as CapacitacionDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "capacitacionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Capacitacion: Model<CapacitacionDocument> =
  mongoose.model<CapacitacionDocument>("Capacitacion", capacitacionSchema);
export { Capacitacion, CapacitacionInput, CapacitacionDocument, NIVEL_LIST };
