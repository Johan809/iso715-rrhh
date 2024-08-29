import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const IDIOMA_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

type IdiomaDocument = Document & {
  idsec: Number;
  nombre: string;
  estado: string;
};

type IdiomaInput = {
  nombre: IdiomaDocument["nombre"];
  estado: IdiomaDocument["estado"];
};

const idiomaSchema = new Schema(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    nombre: {
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
    collection: "idiomas",
    timestamps: true,
  }
);

idiomaSchema.pre("save", async function (next) {
  const doc = this as IdiomaDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "idiomaId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Idioma: Model<IdiomaDocument> = mongoose.model<IdiomaDocument>(
  "Idioma",
  idiomaSchema
);
export { Idioma, IdiomaInput, IdiomaDocument, IDIOMA_ESTADOS };
