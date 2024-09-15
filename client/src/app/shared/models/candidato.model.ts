import { LabelValuePair } from 'src/app/lib/types';
import { Capacitacion } from './capacitacion.model';
import { Competencia } from './competencia.model';
import { ExperienciaLaboral } from './experiencia-laboral.model';
import { Puesto } from './puesto.model';

const ESTADOS = {
  ACTIVO: 'A',
  ACTIVO_LABEL: 'Activo',
  INACTIVO: 'I',
  INACTIVO_LABEL: 'Cancelado',
  CONTRATADO: 'C',
  CONTRATADO_LABEL: 'Contratado',
  RECHAZADO: 'R',
  RECHAZADO_LABEL: 'Rechazado',
};

export class Candidato {
  idsec: number;
  cedula?: string;
  nombre?: string;
  puesto?: Puesto | number;
  departamento?: string;
  salarioAspira?: number;
  competencias?: Competencia[] | number[];
  capacitaciones?: Capacitacion[] | number[];
  experienciaLaboral?: ExperienciaLaboral[] | number[];
  recomendadoPor?: string;
  user_name?: string;
  estado: string = ESTADOS.ACTIVO;

  constructor() {
    this.idsec = 0;
    this.cedula = '';
    this.nombre = '';
    this.puesto = new Puesto();
    this.departamento = '';
    this.salarioAspira = 0;
    this.competencias = [];
    this.capacitaciones = [];
    this.experienciaLaboral = [];
    this.recomendadoPor = '';
    this.user_name = '';
  }

  static get ESTADOS_LIST(): LabelValuePair[] {
    return [
      { label: ESTADOS.ACTIVO_LABEL, value: ESTADOS.ACTIVO },
      { label: ESTADOS.INACTIVO_LABEL, value: ESTADOS.INACTIVO },
      { label: ESTADOS.CONTRATADO_LABEL, value: ESTADOS.CONTRATADO },
      { label: ESTADOS.RECHAZADO_LABEL, value: ESTADOS.RECHAZADO },
    ];
  }

  static get ESTADOS() {
    return ESTADOS;
  }

  static Where = class {
    id?: number;
    nombre?: string;
    cedula?: string;
    puestoIdSec?: number;
    departamento?: string;
    salarioMin?: number;
    salarioMax?: number;
    user_name?: string;
    estado?: string;
  };
}
