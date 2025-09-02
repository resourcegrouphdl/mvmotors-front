
// ==================== ENUMS ====================

export enum TipoDeCliente {
  TITULAR = 'titular',
  FIADOR = 'fiador'
}

export enum TipoDocumento {
  DNI = 'dni',
  PASAPORTE = 'pasaporte',
  CARNET_EXTRANJERIA = 'carnet_extranjeria'
}

export enum EstadoCivil {
  SOLTERO = 'soltero',
  CASADO = 'casado',
  DIVORCIADO = 'divorciado',
  VIUDO = 'viudo'
}

export enum Genero {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  OTRO = 'otro'
}

export enum Ocupacion {
  DEPENDIENTE = 'dependiente',
  INDEPENDIENTE = 'independiente'
}

export enum RangoIngresos {
  '1000-1500' = '1000-1500',
  '1500-2000' = '1500-2000',
  '2000+' = '2000+'
}

export enum TipoVivienda {
  ALQUILADO = 'alquilado',
  FAMILIAR = 'familiar',
  PROPIO = 'propio'
}

export enum LicenciaConducir {
  VIGENTE = 'vigente',
  VENCIDO = 'vencido',
  NO_TENGO = 'noTengo',
  EN_TRAMITE = 'enTramite'
}

export enum TipoReferencia {
  PERSONAL = 'personal',
  FAMILIAR = 'familiar',
  LABORAL = 'laboral'
}

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  EN_EVALUACION = 'enEvaluacion'
}

export enum MarcaMoto {
  Hero = 'Hero',
  Lifan = 'Lifan',
  Jch = 'Jch',
  Maquimotora = 'Maquimotora',
  Duconda = 'Duconda',
  Orocual = 'Orocual',
  Keeway = 'Keeway',
  Ssenda = 'Ssenda',
  Sonlink = 'Sonlink',
  Bera = 'Bera',
  Polux = 'Polux',
  Nexus = 'Nexus',
  Ronco = 'Ronco',
  Bajaj = 'Bajaj',
  Ebenezer = 'Ebenezer',
  Advance = 'Advance',
  Rtm = 'Rtm',
  Fenix = 'Fenix',
  Rezzio = 'Rezzio',
  Wanxin = 'Wanxin',
  Zongshen = 'Zongshen',
  Benelli = 'Benelli',
  CfMoto = 'Cf Moto',
  TVS = 'TVS',
  Honda = 'Honda',
  Suzuki = 'Suzuki',
  Yamaha = 'Yamaha',
  KTM = 'KTM',
  Artsun = 'Artsun',
  Davest = 'Davest'
}

export const MarcasMotosArray: string[] = [
  'Hero',
  'Lifan',
  'Jch',
  'Maquimotora',
  'Duconda',
  'Orocual',
  'Keeway',
  'Ssenda',
  'Sonlink',
  'Bera',
  'Polux',
  'Nexus',
  'Ronco',
  'Bajaj',
  'Ebenezer',
  'Advance',
  'Rtm',
  'Fenix',
  'Rezzio',
  'Wanxin',
  'Zongshen',
  'Benelli',
  'Cf Moto',
  'TVS',
  'Honda',
  'Suzuki',
  'Yamaha',
  'KTM',
  'Artsun',
  'Davest'
]