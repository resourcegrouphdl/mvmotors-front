export interface LibroDeReclamacionesModel {
  // Información del proveedor (usualmente fija)
  razonSocial: string; // Ej. "Mi Empresa SAC"
  ruc: string; // Ej. "20512345678"

  // Datos del consumidor
  nombreCompleto: string;
  documento: string; // DNI o Carnet de Extranjería
  correo: string;
  telefono: string;

  // Reclamo o queja
  tipo: 'reclamo' | 'queja';
  productoServicio: string;
  detalle: string;

  // Aceptación
  aceptaTerminos: boolean;
}
