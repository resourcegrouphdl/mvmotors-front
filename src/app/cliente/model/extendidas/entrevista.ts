import { ArchivoDocumento } from "./documento-yarchivos";

export interface Entrevista {
  id: string;
  solicitudId: string;
  tipoEntrevista: TipoEntrevista;
  clienteId: string; // titular o fiador
  fechaProgramada: Date;
  fechaRealizada?: Date;
  entrevistadorId: string;
  modalidad: ModalidadEntrevista;
  estado: EstadoEntrevista;
  duracionMinutos?: number;
  calificacion?: CalificacionEntrevista;
  observaciones?: string;
  preguntas: PreguntaEntrevista[];
  grabacion?: ArchivoDocumento;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreguntaEntrevista {
  id: string;
  pregunta: string;
  respuesta?: string;
  calificacion?: number; // 1-5
  observaciones?: string;
  categoria: CategoriaPregunata;
}

export enum TipoEntrevista {
  TITULAR = 'titular',
  FIADOR = 'fiador',
  REFERENCIAS = 'referencias',
  SEGUIMIENTO = 'seguimiento'
}

export enum ModalidadEntrevista {
  PRESENCIAL = 'presencial',
  TELEFONICA = 'telefonica',
  VIDEO_LLAMADA = 'video_llamada',
  WHATSAPP = 'whatsapp'
}

export enum EstadoEntrevista {
  PROGRAMADA = 'programada',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
  NO_CONTACTADO = 'no_contactado',
  REPROGRAMADA = 'reprogramada'
}

export enum CalificacionEntrevista {
  MUY_BUENA = 'muy_buena',
  BUENA = 'buena',
  REGULAR = 'regular',
  MALA = 'mala',
  MUY_MALA = 'muy_mala'
}

export enum CategoriaPregunata {
  INFORMACION_PERSONAL = 'informacion_personal',
  SITUACION_ECONOMICA = 'situacion_economica',
  CAPACIDAD_PAGO = 'capacidad_pago',
  REFERENCIAS = 'referencias',
  MOTIVACION_COMPRA = 'motivacion_compra',
  OTROS = 'otros'
}