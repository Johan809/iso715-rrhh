import { LabelValuePair } from 'src/app/lib/types';
import { Idioma } from './idioma.model';

const PUESTO_ESTADOS = {
  ACTIVO: 'A',
  ACTIVO_LABEL: 'Activo',
  INACTIVO: 'I',
  INACTIVO_LABEL: 'Inactivo',
};

const NIVEL_RIESGO = {
  ALTO: 'ALTO',
  MEDIO: 'MEDIO',
  BAJO: 'BAJO',
};

export class Puesto {
  _id?: string;
  idsec: number;
  nombre: string;
  descripcion: string;
  nivelRiesgo?: string;
  nivelMinimoSalario?: number;
  nivelMaximoSalario?: number;
  idioma?: Idioma | number;
  estado: string;

  constructor() {
    this.idsec = 0;
    this.nombre = '';
    this.descripcion = '';
    this.estado = PUESTO_ESTADOS.ACTIVO;
  }

  static get EstadosList(): LabelValuePair[] {
    return [
      { label: PUESTO_ESTADOS.ACTIVO_LABEL, value: PUESTO_ESTADOS.ACTIVO },
      { label: PUESTO_ESTADOS.INACTIVO_LABEL, value: PUESTO_ESTADOS.INACTIVO },
    ];
  }

  static get NivelRiesgoList(): LabelValuePair[] {
    return [
      { label: 'Alto', value: NIVEL_RIESGO.ALTO },
      { label: 'Medio', value: NIVEL_RIESGO.MEDIO },
      { label: 'Bajo', value: NIVEL_RIESGO.BAJO },
    ];
  }

  static Where = class {
    idsec?: number;
    nombre?: string;
    nivelRiesgo?: string;
    estado?: string;
  };
}
