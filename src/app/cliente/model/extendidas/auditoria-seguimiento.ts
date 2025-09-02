// ================================================================
// AUDITORÍA Y SEGUIMIENTO
// ================================================================

export interface RegistroAuditoria {
  id: string;
  entidad: string; // 'solicitud', 'cliente', 'documento', etc.
  entidadId: string;
  accion: AccionAuditoria;
  usuario: UsuarioAuditoria;
  datosAnteriores?: any;
  datosNuevos?: any;
  motivo?: string;
  descripcion?: string;
  ip?: string;
  userAgent?: string;
  fechaHora: Date;
}

export interface UsuarioAuditoria {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  tienda?: string;
}

export enum AccionAuditoria {
  CREAR = 'crear',
  ACTUALIZAR = 'actualizar',
  ELIMINAR = 'eliminar',
  APROBAR = 'aprobar',
  RECHAZAR = 'rechazar',
  SUBIR_DOCUMENTO = 'subir_documento',
  VALIDAR_DOCUMENTO = 'validar_documento',
  PROGRAMAR_ENTREVISTA = 'programar_entrevista',
  REALIZAR_ENTREVISTA = 'realizar_entrevista',
  CAMBIAR_ESTADO = 'cambiar_estado',
  ASIGNAR = 'asignar',
  LOGIN = 'login',
  LOGOUT = 'logout'
}

export enum RolUsuario {
  VENDEDOR = 'vendedor',
  SUPERVISOR_VENTAS = 'supervisor_ventas',
  ANALISTA_CREDITO = 'analista_credito',
  SUPERVISOR_CREDITO = 'supervisor_credito',
  GERENTE = 'gerente',
  ADMIN = 'admin'
}
