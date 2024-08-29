import mongoose, { Schema, Document } from 'mongoose';

type CounterDocument = Document & {
  _id: string;
  seq: number;
};

const counterSchema = new Schema<CounterDocument>({
  // Nombre único para la secuencia (e.g., 'competenciaId')
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model<CounterDocument>('Counter', counterSchema);
export { Counter };
