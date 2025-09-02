export interface Comision {
  id: string;
  solicitudId: string;
  vendedorId: string;
  tipoComision: TipoComision;
  montoBase: number;
  porcentaje: number;
  montoComision: number;
  estado: EstadoComision;
  fechaGeneracion: Date;
  fechaPago?: Date;
  metodoPago?: MetodoPago;
  numeroTransaccion?: string;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TipoComision {
  VENTA = 'venta',
  BONO_META = 'bono_meta',
  INCENTIVO = 'incentivo',
  DESCUENTO = 'descuento',
}

export enum EstadoComision {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  PAGADA = 'pagada',
  CANCELADA = 'cancelada',
  DISPUTADA = 'disputada',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  DEPOSITO = 'deposito',
  CHEQUE = 'cheque',
}
