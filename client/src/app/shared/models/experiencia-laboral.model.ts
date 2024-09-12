import { DateObject } from 'src/app/lib/types';

export class ExperienciaLaboral {
  _id?: string;
  idsec: number;
  empresa?: string;
  puestoOcupado?: string;
  fechaDesde?: Date | DateObject | string;
  fechaHasta?: Date | DateObject | string;
  salario?: number;
  user_name?: string;

  constructor() {
    this.idsec = 0;
  }

  public initDates() {
    if (this.fechaDesde && typeof this.fechaDesde == 'object') {
      let dObj = <DateObject>this.fechaDesde;
      this.fechaDesde = new Date(dObj.year, dObj.month - 1, dObj.day);
    }
    if (this.fechaHasta && typeof this.fechaHasta == 'object') {
      let dObj = <DateObject>this.fechaHasta;
      this.fechaHasta = new Date(dObj.year, dObj.month - 1, dObj.day);
    }
  }

  static Where = class {
    empresa?: string;
    puestoOcupado?: string;
    fechaDesde?: Date | DateObject | string;
    fechaHasta?: Date | DateObject | string;
    salario?: number;
    user_name?: string;

    public initDates() {
      if (this.fechaDesde && typeof this.fechaDesde == 'object') {
        let dObj = <DateObject>this.fechaDesde;
        this.fechaDesde = new Date(dObj.year, dObj.month - 1, dObj.day);
      }
      if (this.fechaHasta && typeof this.fechaHasta == 'object') {
        let dObj = <DateObject>this.fechaHasta;
        this.fechaHasta = new Date(dObj.year, dObj.month - 1, dObj.day);
      }
    }
  };
}
