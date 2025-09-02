import { TipoReferencia } from "./enums";

export interface DatosReferencia {
  nombres: string;
  apellidos: string;
  telefono: string;
  relacion: string;
  tiempoConocimiento: string;
  ocupacion?: string;
}

export interface Referencia {
  id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  parentesco: string; // Para compatibilidad con campos existentes
  relacion: string;   // Nuevo campo que puede reemplazar parentesco
  titularId: string;
  
  // Campos adicionales
  tipo: TipoReferencia;
  ocupacion?: string;
  empresa?: string;
  tiempoConocimiento: string;
  direccion?: string;
  verificado: boolean;
  fechaVerificacion?: Date;
  observaciones?: string;
  
  createdAt: Date;
  updatedAt: Date;
}