// ================================================================
// TIPOS PARA FORMULARIOS Y UI
// ================================================================

export interface OpcionSelect {
  value: string | number;
  label: string;
  disabled?: boolean;
  grupo?: string;
  metadatos?: any;
}

export interface ConfiguracionTabla {
  columnas: ColumnaTabla[];
  paginacion: boolean;
  busqueda: boolean;
  filtros: boolean;
  ordenamiento: boolean;
  seleccionMultiple: boolean;
  acciones: AccionTabla[];
}

export interface ColumnaTabla {
  key: string;
  titulo: string;
  tipo: TipoColumna;
  ordenable: boolean;
  filtrable: boolean;
  visible: boolean;
  ancho?: string;
  formato?: string;
}

export interface AccionTabla {
  key: string;
  titulo: string;
  icono?: string;
  color?: string;
  condicion?: (item: any) => boolean;
}

export enum TipoColumna {
  TEXTO = 'texto',
  NUMERO = 'numero',
  FECHA = 'fecha',
  BOOLEANO = 'booleano',
  ESTADO = 'estado',
  MONEDA = 'moneda',
  PORCENTAJE = 'porcentaje',
  ACCIONES = 'acciones'
}
