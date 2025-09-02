export interface ProcesoEvaluacion {
  id: string;
  solicitudId: string;
  etapas: EtapaEvaluacion[];
  estadoActual: EstadoProceso;
  porcentajeAvance: number;
  fechaInicio: Date;
  fechaEstimadaFinalizacion?: Date;
  fechaFinalizacion?: Date;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EtapaEvaluacion {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
  estado: EstadoEtapa;
  fechaInicio?: Date;
  fechaFinalizacion?: Date;
  responsable?: string;
  documentosRequeridos: string[];
  observaciones?: string;
  tareas: TareaEtapa[];
}

export interface TareaEtapa {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoTarea;
  fechaVencimiento?: Date;
  fechaCompletada?: Date;
  asignadoA?: string;
  resultado?: string;
  observaciones?: string;
}

export enum EstadoProceso {
  INICIADO = 'iniciado',
  EN_PROGRESO = 'en_progreso',
  PAUSADO = 'pausado',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
  RECHAZADO = 'rechazado'
}

export enum EstadoEtapa {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado',
  BLOQUEADO = 'bloqueado',
  OMITIDO = 'omitido'
}

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado',
  FALLIDO = 'fallido',
  CANCELADO = 'cancelado'
}

