import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { Puesto } from './puesto.model';
import { DateObject, LabelValuePair } from 'src/app/lib/types';

export class Empleado {
  idsec: number;
  cedula: string;
  nombre?: string;
  fechaIngreso?: Date | DateObject | string;
  departamento?: string;
  puesto: number | Puesto;
  salarioMensual: number;
  estado: string = ESTADOS_DEFECTO.ACTIVO;

  constructor() {
    this.idsec = 0;
    this.puesto = 0;
    this.salarioMensual = 0;
    this.cedula = '';
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

  public initDates() {
    if (this.fechaIngreso && typeof this.fechaIngreso == 'object') {
      let dObj = <DateObject>this.fechaIngreso;
      this.fechaIngreso = new Date(dObj.year, dObj.month - 1, dObj.day);
    }
  }

  static Where = class {
    nombre?: string;
    cedula?: string;
    puestoIdSec?: number;
    departamento?: string;
    estado?: string = '';
    fechaInicio?: Date;
    fechaInicioObj?: DateObject;
    fechaFin?: Date;
    fechaFinObj?: DateObject;
    _puestoNombre?: string;

    public initDates() {
      if (this.fechaInicioObj && typeof this.fechaInicioObj == 'object') {
        let dObj = this.fechaInicioObj;
        this.fechaInicio = new Date(dObj.year, dObj.month - 1, dObj.day);
      } else this.fechaInicio = undefined;
      if (this.fechaFinObj && typeof this.fechaFinObj == 'object') {
        let dObj = this.fechaFinObj;
        this.fechaFin = new Date(dObj.year, dObj.month - 1, dObj.day);
      } else this.fechaFin = undefined;
    }
  };
}
