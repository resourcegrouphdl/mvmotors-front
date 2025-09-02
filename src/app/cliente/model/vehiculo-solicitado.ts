import { MarcaMoto } from "./enums";

export interface VehiculoSolicitado {
  id: string;
  marca: MarcaMoto;
  modelo: string;
  color: string;
  anio: number;
  precio?: number; // Agregado para correlación con solicitud
  
  createdAt: Date;
  updatedAt: Date;
}