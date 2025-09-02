export interface KpiMetrica {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  valorAnterior?: number;
  unidad: string;
  tendencia?: TendenciaKpi;
  porcentajeCambio?: number;
  fechaCalculo: Date;
  parametros?: {
    periodo: PeriodoKpi;
    filtros?: any;
  };
  meta?: number;
  porcentajeMeta?: number;
}

export interface DashboardKpi {
  vendedorId?: string;
  tienda?: string;
  periodo: PeriodoKpi;
  metricas: {
    // Métricas de solicitudes
    totalSolicitudes: KpiMetrica;
    solicitudesAprobadas: KpiMetrica;
    solicitudesRechazadas: KpiMetrica;
    solicitudesPendientes: KpiMetrica;
    tasaAprobacion: KpiMetrica;
    
    // Métricas de tiempo
    tiempoPromedioAprobacion: KpiMetrica;
    solicitudesVencidas: KpiMetrica;
    
    // Métricas financieras
    montoTotalFinanciado: KpiMetrica;
    comisionesGeneradas: KpiMetrica;
    ticketPromedio: KpiMetrica;
    
    // Métricas de proceso
    documentosPendientes: KpiMetrica;
    entrevistasPendientes: KpiMetrica;
    tramitesPendientes: KpiMetrica;
  };
  fechaActualizacion: Date;
}

export enum TendenciaKpi {
  SUBIENDO = 'subiendo',
  BAJANDO = 'bajando',
  ESTABLE = 'estable'
}

export enum PeriodoKpi {
  HOY = 'hoy',
  AYER = 'ayer',
  ESTA_SEMANA = 'esta_semana',
  SEMANA_PASADA = 'semana_pasada',
  ESTE_MES = 'este_mes',
  MES_PASADO = 'mes_pasado',
  ESTE_TRIMESTRE = 'este_trimestre',
  TRIMESTRE_PASADO = 'trimestre_pasado',
  ESTE_ANO = 'este_ano',
  ANO_PASADO = 'ano_pasado',
  PERSONALIZADO = 'personalizado'
}
