import { RoleLevel } from '@enums/role-level.enum';
import { RoleType } from 'src/app/lib/types';

export class Usuario {
  idsec: number = 0;
  nombre: string = '';
  email: string = '';
  password?: string;
  role: RoleType | number;
  estado: boolean = true;

  constructor() {
    this.role = {
      idsec: 1,
      nombre: 'Usuario',
      nivel: RoleLevel.USER,
    };
  }

  static Where = class {
    nombre?: string;
    email?: string;
    estado?: boolean;
    //aqui se buscar por el identificador interno de la db
    role?: number;
  };
}
