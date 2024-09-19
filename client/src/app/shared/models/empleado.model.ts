import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { Puesto } from './puesto.model';

export class Empleado {
  idsec: number;
  cedula?: string;
  nombre?: string;
  fechaIngreso?: Date;
  departamento?: string;
  puesto: number | Puesto;
  salarioMensual: number;
  estado: string = ESTADOS_DEFECTO.ACTIVO;

  constructor() {
    this.idsec = 0;
    this.puesto = 0;
    this.salarioMensual = 0;
  }

  static Where = class {
    nombre?: string;
    puestoIdSec?: number;
    departamento?: string;
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  };
}
