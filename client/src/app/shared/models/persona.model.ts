export class Persona {
  idsec: number = 0;
  nombre: string = '';
  documento: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  estado: boolean = true;

  constructor() {}

  static Where = class {
    nombre?: string;
    documento?: string;
    email?: string;
    telefono?: string;
    estado?: boolean;
  };
}
