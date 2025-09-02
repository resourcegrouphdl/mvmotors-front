import { ArchivoDocumento } from './documento-yarchivos';

export interface TramitePostVenta {
  id: string;
  solicitudId: string;
  tipoTramite: TipoTramite;
  estado: EstadoTramite;
  fechaInicio?: Date;
  fechaEstimada?: Date;
  fechaCompletado?: Date;
  responsable?: string;
  proveedor?: string;
  costoTramite?: number;
  numeroDocumento?: string;
  observaciones?: string;
  documentos: ArchivoDocumento[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TipoTramite {
  TARJETA_PROPIEDAD = 'tarjeta_propiedad',
  SOAT = 'soat',
  TITULO_PROPIEDAD = 'titulo_propiedad',
  PLACA = 'placa',
  REVISION_TECNICA = 'revision_tecnica',
}

export enum EstadoTramite {
  NO_INICIADO = 'no_iniciado',
  EN_TRAMITE = 'en_tramite',
  ESPERANDO_DOCUMENTOS = 'esperando_documentos',
  COMPLETADO = 'completado',
  RECHAZADO = 'rechazado',
  VENCIDO = 'vencido',
}

