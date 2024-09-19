import { RoleLevel } from '@enums/role-level.enum';
import { Puesto } from '@models/puesto.model';

export type UserInfo = {
  username: string;
  email: string;
  role: number;
};

export type CapacitacionWhere = {
  idsec?: number;
  descripcion?: string;
  nivel?: string;
  fechaDesde?: string | Date | DateObject;
  fechaHasta?: string | Date | DateObject;
  institucion?: string;
  user_name?: string;
};

export type PuestoWhere = {
  idsec?: number;
  nombre?: string;
  nivelRiesgo?: string;
  estado?: string;
};

export type DateObject = { year: number; month: number; day: number };

export type LabelValuePair = {
  label: string;
  value: string | number;
};

export type ExperienciaLaboralWhere = {
  empresa?: string;
  puestoOcupado?: string;
  fechaDesde?: Date | DateObject | string;
  fechaHasta?: Date | DateObject | string;
  salario?: number;
  user_name?: string;
};

export type CandidatoWhere = {
  id?: number;
  nombre?: string;
  puestoIdSec?: number;
  departamento?: string;
  salarioMin?: number;
  salarioMax?: number;
  user_name?: string;
};

export type RoleType = {
  idsec: number;
  nombre: string;
  nivel: RoleLevel;
};

export type UsuarioWhere = {
  nombre?: string;
  email?: string;
  estado?: boolean;
  role?: number;
};

export type DatosContratacionType = {
  departamento: string;
  fechaIngreso: DateObject;
  salario: number;
  puesto?: Puesto;
};

export type EmpleadoWhere = {
  nombre?: string;
  puestoIdSec?: number;
  departamento?: string;
  estado?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
};
