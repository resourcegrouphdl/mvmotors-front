// ================================================================
// NOTIFICACIONES
// ================================================================

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  destinatarios: DestinatarioNotificacion[];
  canal: CanalNotificacion;
  prioridad: PrioridadNotificacion;
  estado: EstadoNotificacion;
  metadatos?: {
    solicitudId?: string;
    clienteId?: string;
    entidadTipo?: string;
    entidadId?: string;
    accion?: string;
    [key: string]: any;
  };
  fechaProgramada?: Date;
  fechaEnviado?: Date;
  fechaLeido?: Date;
  intentosEnvio?: number;
  ultimoError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DestinatarioNotificacion {
  usuarioId: string;
  nombre: string;
  email?: string;
  telefono?: string;
  leido: boolean;
  fechaLeido?: Date;
}

export enum TipoNotificacion {
  NUEVA_SOLICITUD = 'nueva_solicitud',
  SOLICITUD_APROBADA = 'solicitud_aprobada',
  SOLICITUD_RECHAZADA = 'solicitud_rechazada',
  DOCUMENTO_PENDIENTE = 'documento_pendiente',
  DOCUMENTO_RECHAZADO = 'documento_rechazado',
  ENTREVISTA_PROGRAMADA = 'entrevista_programada',
  ENTREVISTA_RECORDATORIO = 'entrevista_recordatorio',
  PROCESO_VENCIDO = 'proceso_vencido',
  TRAMITE_COMPLETADO = 'tramite_completado',
  COMISION_GENERADA = 'comision_generada',
  RECORDATORIO = 'recordatorio',
  ALERTA = 'alerta',
  INFORMATIVO = 'informativo'
}

export enum CanalNotificacion {
  EN_APP = 'en_app',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push'
}

export enum PrioridadNotificacion {
  BAJA = 'baja',
  NORMAL = 'normal',
  ALTA = 'alta',
  CRITICA = 'critica'
}

export enum EstadoNotificacion {
  PENDIENTE = 'pendiente',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  LEIDO = 'leido',
  ERROR = 'error',
  CANCELADO = 'cancelado'
}