import { ESTADOS_DEFECTO } from 'src/app/lib/constants';

export class Competencia {
  public idsec: number;
  public descripcion: string | undefined;
  public estado: string = ESTADOS_DEFECTO.ACTIVO;
  public createdAt: Date | string | undefined;
  public updatedAt: Date | string | undefined;
  public _id: string | undefined;

  constructor() {
    this.idsec = 0;
  }

  public initDates() {
    if (this.createdAt && typeof this.createdAt == 'string')
      this.createdAt = new Date(<string>this.createdAt);
    if (this.updatedAt && typeof this.updatedAt == 'string')
      this.updatedAt = new Date(<string>this.updatedAt);
  }

  public get estadoDesc(): string {
    switch (this.estado) {
      case 'A':
        return 'Activa';
      case 'I':
        return 'Inactiva';
      default:
        return '';
    }
  }

  static Where = class {
    descripcion: string = '';
    estado: string = '';
  };
}
