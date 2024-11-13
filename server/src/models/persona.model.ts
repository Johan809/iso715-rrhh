import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";
import { EMAIL_REGEX, PHONE_REGEX, DOCUMENTO_REGEX } from "../lib/constants";

const PERSONA_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

type PersonaDocument = Document & {
  idsec: number;
  nombre: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
  estado: boolean;
};

interface IPersonaModel extends Model<PersonaDocument> {}

type PersonaInput = {
  nombre: PersonaDocument["nombre"];
  email: PersonaDocument["email"];
  telefono: PersonaDocument["telefono"];
  documento: PersonaDocument["documento"];
  direccion: PersonaDocument["direccion"];
  estado: PersonaDocument["estado"];
};

const personaSchema = new Schema<PersonaDocument, IPersonaModel>(
  {
    idsec: {
      type: Schema.Types.Number,
    },
    nombre: {
      type: Schema.Types.String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: Schema.Types.String,
      match: [EMAIL_REGEX, "Por favor ingrese un email válido."],
      required: true,
      unique: true,
    },
    telefono: {
      type: Schema.Types.String,
      match: [PHONE_REGEX, "Por favor ingrese un teléfono válido."],
      required: false,
    },
    documento: {
      type: Schema.Types.String,
      match: [
        DOCUMENTO_REGEX,
        "Por favor ingrese un documento válido en formato ###-#######-#",
      ],
      required: true,
      unique: true,
    },
    direccion: {
      type: Schema.Types.String,
      required: false,
      maxlength: 100,
    },
    estado: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    collection: "personas",
    timestamps: true,
  }
);

personaSchema.pre("save", async function (next) {
  const doc = this as PersonaDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "personaId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Persona = mongoose.model<PersonaDocument, IPersonaModel>(
  "Persona",
  personaSchema
);
export { Persona, PersonaInput, PersonaDocument, PERSONA_ESTADOS };
