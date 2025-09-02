// ================================================================
// CONFIGURACIÓN Y PARÁMETROS
// ================================================================

export interface ConfiguracionSistema {
  id: string;
  categoria: CategoriaConfiguracion;
  clave: string;
  valor: any;
  descripcion: string;
  tipo: TipoConfiguracion;
  validacion?: string; // regex o función de validación
  requerido: boolean;
  visible: boolean;
  modificadoPor?: string;
  fechaModificacion?: Date;
}

export enum CategoriaConfiguracion {
  EVALUACION = 'evaluacion',
  DOCUMENTOS = 'documentos',
  NOTIFICACIONES = 'notificaciones',
  COMISIONES = 'comisiones',
  TIEMPOS_PROCESO = 'tiempos_proceso',
  INTEGRACIONES = 'integraciones',
  GENERAL = 'general'
}

export enum TipoConfiguracion {
  TEXTO = 'texto',
  NUMERO = 'numero',
  BOOLEANO = 'booleano',
  FECHA = 'fecha',
  LISTA = 'lista',
  JSON = 'json'
}