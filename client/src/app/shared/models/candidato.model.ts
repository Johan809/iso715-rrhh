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
  competencias: Competencia[] | number[];
  capacitaciones: Capacitacion[] | number[];
  experienciaLaboral: ExperienciaLaboral[] | number[];
  recomendadoPor?: string;
  user_name?: string;
  estado: string = ESTADOS.ACTIVO;

  _competenciaList: LabelValuePair[] = [];
  _capacitacionList: LabelValuePair[] = [];
  _experienciaList: LabelValuePair[] = [];

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
    this.estado = ESTADOS.ACTIVO;
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

  public assignCompetencias(): void {
    this.competencias = this._competenciaList.map(
      (competencia) => competencia.value as number
    );
  }

  public assignCapacitaciones(): void {
    this.capacitaciones = this._capacitacionList.map(
      (capacitacion) => capacitacion.value as number
    );
  }

  public assignExperiencias(): void {
    this.experienciaLaboral = this._experienciaList.map(
      (experiencia) => experiencia.value as number
    );
  }

  public fillCompetenciaList(): void {
    if (Array.isArray(this.competencias)) {
      this._competenciaList = (this.competencias as Competencia[]).map(
        (competencia) => ({
          label: competencia.descripcion ?? '',
          value: competencia.idsec,
        })
      );
    }
  }

  public fillCapacitacionList(): void {
    if (Array.isArray(this.capacitaciones)) {
      this._capacitacionList = (this.capacitaciones as Capacitacion[]).map(
        (capacitacion) => ({
          label: capacitacion.descripcion ?? '',
          value: capacitacion.idsec,
        })
      );
    }
  }

  public fillExperienciaList(): void {
    if (Array.isArray(this.experienciaLaboral)) {
      this._experienciaList = (
        this.experienciaLaboral as ExperienciaLaboral[]
      ).map((experiencia) => ({
        label: experiencia.puestoOcupado ?? '',
        value: experiencia.idsec,
      }));
    }
  }

  static Where = class {
    id?: number;
    nombre?: string;
    cedula?: string;
    puestoIdSec?: number;
    competenciaIdSec?: number;
    capacitacionIdSec?: number;
    departamento?: string;
    salarioMin?: number;
    salarioMax?: number;
    user_name?: string;
    estado?: string;
  };
}
