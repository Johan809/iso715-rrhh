export type UserInfo = {
  username: string;
  email: string;
  role: number;
};

export type CapacitacionWhere = {
  idsec?: number;
  descripcion?: string;
  nivel?: string;
  fechaDesde?: string | Date;
  fechaHasta?: string | Date;
  institucion?: string;
  user_name?: string;
};

export type LabelValuePair = {
  label: string;
  value: string | number;
};
