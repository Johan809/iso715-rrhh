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

export type DateObject = { year: number; month: number; day: number };

export type LabelValuePair = {
  label: string;
  value: string | number;
};
