import mongoose, { Schema, Model, Document } from "mongoose";
import { Counter } from "./contador.schema";

const EMPLEADO_ESTADOS = {
  ACTIVO: "A",
  ACTIVO_LABEL: "Activo",
  INACTIVO: "I",
  INACTIVO_LABEL: "Inactivo",
};

type EmpleadoDocument = Document & {
  idsec: number;
  cedula: string;
  nombre: string;
  fechaIngreso: Date;
  departamento: string;
  puesto: Schema.Types.ObjectId; // Referencia al esquema Puesto
  salarioMensual: number;
  estado: string;
};

type EmpleadoInput = {
  cedula: EmpleadoDocument["cedula"];
  nombre: EmpleadoDocument["nombre"];
  fechaIngreso: EmpleadoDocument["fechaIngreso"];
  departamento: EmpleadoDocument["departamento"];
  puesto: EmpleadoDocument["puesto"];
  salarioMensual: EmpleadoDocument["salarioMensual"];
  estado: EmpleadoDocument["estado"];
};

const empleadoSchema = new Schema<EmpleadoDocument>(
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
    fechaIngreso: {
      type: Schema.Types.Date,
      required: true,
    },
    departamento: {
      type: Schema.Types.String,
      required: true,
    },
    puesto: {
      type: Schema.Types.ObjectId,
      ref: "Puesto",
      required: true,
    },
    salarioMensual: {
      type: Schema.Types.Number,
      required: true,
    },
    estado: {
      type: Schema.Types.String,
      required: true,
      enum: [EMPLEADO_ESTADOS.ACTIVO, EMPLEADO_ESTADOS.INACTIVO],
    },
  },
  {
    collection: "empleados",
    timestamps: true,
  }
);

empleadoSchema.pre("save", async function (next) {
  const doc = this as EmpleadoDocument;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "empleadoId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.idsec = counter.seq;
  }

  next();
});

const Empleado: Model<EmpleadoDocument> = mongoose.model<EmpleadoDocument>(
  "Empleado",
  empleadoSchema
);
export { Empleado, EmpleadoInput, EmpleadoDocument, EMPLEADO_ESTADOS };
