import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const COMPETENCIA_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

type CompetenciaDocument = Document & {
  _id: number;
  descripcion: string;
  estado: string;
};

type CompetenciaInput = {
  descripcion: CompetenciaDocument["descripcion"];
  estado: CompetenciaDocument["estado"];
};

const competenciaSchema = new Schema(
  {
    _id: {
      type: Schema.Types.Number,
    },
    descripcion: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    estado: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: "competencias",
    timestamps: true,
  }
);

competenciaSchema.pre("save", async function (next) {
  const doc = this as CompetenciaDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "competenciaId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc._id = counter.seq;
  }

  next();
});

const Competencia: Model<CompetenciaDocument> =
  mongoose.model<CompetenciaDocument>("Competencia", competenciaSchema);
export {
  Competencia,
  CompetenciaInput,
  CompetenciaDocument,
  COMPETENCIA_ESTADOS,
};
