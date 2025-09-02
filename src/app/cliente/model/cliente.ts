import { EstadoCivil, Genero, LicenciaConducir, Ocupacion, RangoIngresos, TipoDeCliente, TipoDocumento, TipoVivienda } from "./enums";
import { DatosReferencia } from "./referencia";

export interface Cliente {
  id: string;
  tipo: TipoDeCliente;
  documentType: TipoDocumento; // Cambiado para usar el enum
  documentNumber: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estadoCivil: EstadoCivil;
  email: string;
  fechaNacimiento: string;
  departamento: string;
  provincia: string;
  distrito?: string;
  direccion: string;
  telefono1: string;
  telefono2?: string;
  
  // Datos adicionales según titular
  ocupacion?: Ocupacion;
  rangoIngresos?: RangoIngresos;
  tipoVivienda?: TipoVivienda;
  licenciaConducir?: LicenciaConducir;
  numeroLicencia?: string;
  
  // Campos adicionales para el flujo completo
  genero?: Genero;
  lugarNacimiento?: string;
  nombreConyuge?: string;
  numeroHijos?: number;
  empresaTrabajo?: string;
  cargoTrabajo?: string;
  tiempoTrabajo?: string;
  ingresoMensual?: number;
  gastosMensuales?: number;
  otrosIngresos?: number;
  referenciaPersonal1?: DatosReferencia;
  referenciaPersonal2?: DatosReferencia;
  referenciaFamiliar1?: DatosReferencia;
  referenciaFamiliar2?: DatosReferencia;
  
  archivos?: {
    selfie?: string;
    dniFrente?: string;
    dniReverso?: string;
    reciboServicio?: string;
    fachada?: string;
    fotoLicenciaFrente?: string;
    fotoLicenciaReverso?: string;
    certificadoLaboral?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}