import { LabelValuePair } from 'src/app/lib/types';
import { Idioma } from './idioma.model';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';

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
    this.estado = ESTADOS_DEFECTO.ACTIVO;
  }

  static get EstadosList(): LabelValuePair[] {
    return [
      { label: ESTADOS_DEFECTO.ACTIVO_LABEL, value: ESTADOS_DEFECTO.ACTIVO },
      {
        label: ESTADOS_DEFECTO.INACTIVO_LABEL,
        value: ESTADOS_DEFECTO.INACTIVO,
      },
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
