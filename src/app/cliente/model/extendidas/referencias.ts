// ================================================================
// REFERENCIAS AMPLIADAS
// ================================================================

import { Referencia } from "../referencia";

export interface ReferenciaExtendida extends Referencia {
  tipoReferencia: TipoReferencia;
  relacion: RelacionReferencia;
  tiempoConocimiento: string;
  verificaciones: VerificacionReferencia[];
  calificacionGeneral?: number; // 1-10
  observaciones?: string;
  estado: EstadoReferencia;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificacionReferencia {
  id: string;
  fechaLlamada: Date;
  realizadaPor: string;
  duracionMinutos?: number;
  contactado: boolean;
  resultado: ResultadoVerificacion;
  preguntas: PreguntaReferencia[];
  observaciones?: string;
}

export interface PreguntaReferencia {
  id: string;
  pregunta: string;
  respuesta: string;
  calificacion?: number; // 1-5
}

export enum TipoReferencia {
  FAMILIAR = 'familiar',
  LABORAL = 'laboral',
  PERSONAL = 'personal',
  COMERCIAL = 'comercial'
}

export enum RelacionReferencia {
  PADRE = 'padre',
  MADRE = 'madre',
  HERMANO = 'hermano',
  HERMANA = 'hermana',
  HIJO = 'hijo',
  HIJA = 'hija',
  ESPOSO = 'esposo',
  ESPOSA = 'esposa',
  TIO = 'tio',
  TIA = 'tia',
  PRIMO = 'primo',
  PRIMA = 'prima',
  ABUELO = 'abuelo',
  ABUELA = 'abuela',
  JEFE = 'jefe',
  COMPANERO_TRABAJO = 'companero_trabajo',
  AMIGO = 'amigo',
  VECINO = 'vecino',
  CLIENTE = 'cliente',
  PROVEEDOR = 'proveedor',
  OTRO = 'otro'
}

export enum EstadoReferencia {
  PENDIENTE_VERIFICACION = 'pendiente_verificacion',
  EN_VERIFICACION = 'en_verificacion',
  VERIFICADO_POSITIVO = 'verificado_positivo',
  VERIFICADO_NEGATIVO = 'verificado_negativo',
  NO_CONTACTADO = 'no_contactado',
  TELEFONO_INVALIDO = 'telefono_invalido'
}

export enum ResultadoVerificacion {
  MUY_POSITIVO = 'muy_positivo',
  POSITIVO = 'positivo',
  NEUTRAL = 'neutral',
  NEGATIVO = 'negativo',
  MUY_NEGATIVO = 'muy_negativo',
  NO_APLICA = 'no_aplica'
}
