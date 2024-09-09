import { LabelValuePair } from 'src/app/lib/types';

const NIVEL_LIST = {
  GRADO: 'G',
  GRADO_LABEL: 'Grado',
  POSTGRADO: 'P',
  POSTGRADO_LABEL: 'Post-grado',
  MAESTRIA: 'M',
  MAESTRIA_LABEL: 'Maestría',
  DOCTORADO: 'D',
  DOCTORADO_LABEL: 'Doctorado',
  TECNICO: 'T',
  TECNICO_LABEL: 'Técnico',
  GESTION: 'N',
  GESTION_LABEL: 'Gestión',
};

export class Capacitacion {
  public idsec: number;
  public descripcion?: string;
  public nivel?: string;
  public fechaDesde?: Date;
  public fechaHasta?: Date;
  public institucion?: string;
  public user_name?: string;
  public estado: string = 'A';
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

  static get NIVELES(): LabelValuePair[] {
    return [
      { value: NIVEL_LIST.GRADO, label: NIVEL_LIST.GRADO_LABEL },
      { value: NIVEL_LIST.POSTGRADO, label: NIVEL_LIST.POSTGRADO_LABEL },
      { value: NIVEL_LIST.MAESTRIA, label: NIVEL_LIST.MAESTRIA_LABEL },
      { value: NIVEL_LIST.DOCTORADO, label: NIVEL_LIST.DOCTORADO_LABEL },
      { value: NIVEL_LIST.TECNICO, label: NIVEL_LIST.TECNICO_LABEL },
      { value: NIVEL_LIST.GESTION, label: NIVEL_LIST.GESTION_LABEL },
    ];
  }

  static Where = class {
    descripcion: string = '';
    nivel?: string = '';
    fechaDesde?: string | Date;
    fechaHasta?: string | Date;
    institucion?: string;
    user_name?: string;
  };
}
