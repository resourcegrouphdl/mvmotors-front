
export interface DocumentoRequerido {
  id: string;
  solicitudId: string;
  tipoDocumento: TipoDocumento;
  clienteId: string; // titular o fiador
  obligatorio: boolean;
  estado: EstadoDocumento;
  archivo?: ArchivoDocumento;
  fechaSubida?: Date;
  fechaValidacion?: Date;
  validadoPor?: string;
  observaciones?: string;
  motivoRechazo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchivoDocumento {
  id: string;
  nombre: string;
  nombreOriginal: string;
  url: string;
  urlThumbnail?: string;
  tamanio: number;
  tipoMime: string;
  extension: string;
  hash?: string;
  metadatos?: {
    ancho?: number;
    alto?: number;
    duracion?: number;
    [key: string]: any;
  };
}

export enum TipoDocumento {
  // Documentos del titular
  DNI_TITULAR_FRENTE = 'dni_titular_frente',
  DNI_TITULAR_REVERSO = 'dni_titular_reverso',
  SELFIE_TITULAR = 'selfie_titular',
  RECIBO_SERVICIO_TITULAR = 'recibo_servicio_titular',
  FACHADA_DOMICILIO_TITULAR = 'fachada_domicilio_titular',
  LICENCIA_CONDUCIR_FRENTE = 'licencia_conducir_frente',
  LICENCIA_CONDUCIR_REVERSO = 'licencia_conducir_reverso',
  CERTIFICADO_LABORAL = 'certificado_laboral',
  BOLETAS_PAGO = 'boletas_pago',
  CONSTANCIA_INGRESOS = 'constancia_ingresos',
  
  // Documentos del fiador
  DNI_FIADOR_FRENTE = 'dni_fiador_frente',
  DNI_FIADOR_REVERSO = 'dni_fiador_reverso',
  SELFIE_FIADOR = 'selfie_fiador',
  RECIBO_SERVICIO_FIADOR = 'recibo_servicio_fiador',
  FACHADA_DOMICILIO_FIADOR = 'fachada_domicilio_fiador',
  CERTIFICADO_LABORAL_FIADOR = 'certificado_laboral_fiador',
  
  // Documentos del proceso
  VOUCHER_INICIAL = 'voucher_inicial',
  FACTURA_COMPRA = 'factura_compra',
  CONTRATO_FIRMADO = 'contrato_firmado',
  CARTA_APROBACION = 'carta_aprobacion',
  
  // Evidencias
  EVIDENCIA_ENTREGA = 'evidencia_entrega',
  EVIDENCIA_FIRMA = 'evidencia_firma',
  EVIDENCIA_OTRO = 'evidencia_otro'
}

export enum EstadoDocumento {
  PENDIENTE = 'pendiente',
  SUBIDO = 'subido',
  EN_VALIDACION = 'en_validacion',
  VALIDO = 'valido',
  RECHAZADO = 'rechazado',
  VENCIDO = 'vencido'
}
