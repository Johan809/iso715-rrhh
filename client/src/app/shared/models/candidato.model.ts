import { Capacitacion } from './capacitacion.model';
import { Competencia } from './competencia.model';
import { ExperienciaLaboral } from './experiencia-laboral.model';
import { Puesto } from './puesto.model';

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

  static Where = class {
    id?: number;
    nombre?: string;
    puestoIdSec?: number;
    departamento?: string;
    salarioMin?: number;
    salarioMax?: number;
    user_name?: string;
  };
}
