import { EstadoSolicitud } from "./enums";

export interface SolicitudDeCredito {
  id: string;
  titularId: string;
  fiadorId?: string;
  vehiculoId: string;
  referenciasIds: string[];
  
  // Datos financieros
  precioCompraMoto: number;
  inicial: number;
  plazoQuincenas: number;
  montoCuota?: number;
  tasaInteres: number;
  montoFinanciar: number;
  
  // Estado y seguimiento
  estado: EstadoSolicitud;
  fechaSolicitud: Date;
  fechaAprobacion?: Date;
  fechaRechazo?: Date;
  motivoRechazo?: string;
  
  // Evaluación crediticia
  puntajeCrediticio?: number;
  requiereGarantia: boolean;
  observacionesEvaluacion?: string;
  
  // Vendedor
  vendedor: {
    id: string;
    nombre: string;
    tienda: string;
  };
  
  mensajeOpcional?: string;
  
  createdAt: Date;
  updatedAt: Date;
}