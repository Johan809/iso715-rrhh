import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { Puesto } from './puesto.model';
import { DateObject, LabelValuePair } from 'src/app/lib/types';

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

  static get ESTADOS_LIST(): LabelValuePair[] {
    return [
      { label: ESTADOS_DEFECTO.ACTIVO_LABEL, value: ESTADOS_DEFECTO.ACTIVO },
      {
        label: ESTADOS_DEFECTO.INACTIVO_LABEL,
        value: ESTADOS_DEFECTO.INACTIVO,
      },
    ];
  }

  static Where = class {
    nombre?: string;
    cedula?: string;
    puestoIdSec?: number;
    departamento?: string;
    estado?: string;
    fechaInicio?: Date | DateObject;
    fechaFin?: Date | DateObject;
    _puestoNombre?: string;

    public initDates() {
      if (this.fechaInicio && typeof this.fechaInicio == 'object') {
        let dObj = <DateObject>this.fechaInicio;
        this.fechaInicio = new Date(dObj.year, dObj.month - 1, dObj.day);
      }
      if (this.fechaFin && typeof this.fechaFin == 'object') {
        let dObj = <DateObject>this.fechaFin;
        this.fechaFin = new Date(dObj.year, dObj.month - 1, dObj.day);
      }
    }
  };
}
