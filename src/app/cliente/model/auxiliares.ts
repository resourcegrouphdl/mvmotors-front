import { Cliente } from "./cliente";
import { SolicitudDeCredito } from "./solicitud-de-credito";

export interface DocumentoCliente {
  id: string;
  clienteId: string;
  tipo: 'selfie' | 'dniFrente' | 'dniReverso' | 'reciboServicio' | 'fachada' | 'licenciaFrente' | 'licenciaReverso' | 'certificadoLaboral';
  url: string;
  nombreArchivo: string;
  fechaSubida: Date;
  verificado: boolean;
  observaciones?: string;
}

export interface EvaluacionCrediticia {
  id: string;
  solicitudId: string;
  puntajeCalculado: number;
  factores: {
    ingresos: number;
    estabilidadLaboral: number;
    historialCrediticio: number;
    referencias: number;
    documentacion: number;
  };
  recomendacion: 'APROBAR' | 'RECHAZAR' | 'REQUIERE_REVISION';
  observaciones: string;
  fechaEvaluacion: Date;
  evaluadoPor: string;
}

export type EstadoDocumento = 'pendiente' | 'verificado' | 'rechazado';
export type TipoNotificacion = 'solicitud_creada' | 'solicitud_aprobada' | 'solicitud_rechazada' | 'documento_requerido';

export const validarCliente = (cliente: Partial<Cliente>): string[] => {
  const errores: string[] = [];
  
  if (!cliente.documentNumber) errores.push('Número de documento es requerido');
  if (!cliente.nombres) errores.push('Nombres son requeridos');
  if (!cliente.apellidoPaterno) errores.push('Apellido paterno es requerido');
  if (!cliente.email) errores.push('Email es requerido');
  if (!cliente.telefono1) errores.push('Teléfono es requerido');
  if (!cliente.direccion) errores.push('Dirección es requerida');
  
  return errores;
};

export const validarSolicitud = (solicitud: Partial<SolicitudDeCredito>): string[] => {
  const errores: string[] = [];
  
  if (!solicitud.titularId) errores.push('ID del titular es requerido');
  if (!solicitud.vehiculoId) errores.push('ID del vehículo es requerido');
  if (!solicitud.precioCompraMoto || solicitud.precioCompraMoto <= 0) {
    errores.push('Precio de compra debe ser mayor a 0');
  }
  if (!solicitud.inicial || solicitud.inicial < 0) {
    errores.push('Inicial debe ser mayor o igual a 0');
  }
  if (!solicitud.plazoQuincenas || solicitud.plazoQuincenas <= 0) {
    errores.push('Plazo en quincenas debe ser mayor a 0');
  }
  
  return errores;
};