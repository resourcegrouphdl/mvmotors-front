// ================================================================
// TIPOS AUXILIARES Y UTILIDADES
// ================================================================

export interface PaginacionRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filtros?: any;
}

export interface PaginacionResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FiltroAvanzado {
  campo: string;
  operador: OperadorFiltro;
  valor: any;
  logico?: OperadorLogico;
}

export enum OperadorFiltro {
  IGUAL = 'igual',
  DISTINTO = 'distinto',
  MAYOR = 'mayor',
  MAYOR_IGUAL = 'mayor_igual',
  MENOR = 'menor',
  MENOR_IGUAL = 'menor_igual',
  CONTIENE = 'contiene',
  EMPIEZA_CON = 'empieza_con',
  TERMINA_CON = 'termina_con',
  EN = 'en',
  NO_EN = 'no_en',
  NULO = 'nulo',
  NO_NULO = 'no_nulo'
}

export enum OperadorLogico {
  AND = 'and',
  OR = 'or'
}

export interface RespuestaApi<T> {
  success: boolean;
  data?: T;
  error?: {
    codigo: string;
    mensaje: string;
    detalles?: any;
  };
  timestamp: Date;
  requestId?: string;
}

export interface ErrorValidacion {
  campo: string;
  mensaje: string;
  valor?: any;
}