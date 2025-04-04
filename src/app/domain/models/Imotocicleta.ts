
  export interface Motocicleta {
    id: string;
    marca: string;
    modelo: string;
    categoria: string[] ; // Ejemplo: "Deportiva", "Cruiser", "Touring"
    año: number;
    precio: number;
    imagenPrincipal: string; // URL de imagen principal
    imagenesAdicionales: string[]; // Lista de imágenes desde distintos ángulos
    descripcion: string;
    especificaciones: EspecificacionesTecnicas;
    caracteristicasTienda: CaracteristicasTienda;
    promociones: Promocion[];
  }
  
  export interface EspecificacionesTecnicas {
    id: string;
    motor: string;
    cilindrada: number;
    rendimiento: number; // km/litro
    suspencion: string;
    frenos: string;
    velocidadMaxima: number;
    dimenciones: string; // Largo x Ancho x Alto
  }
  
  export interface CaracteristicasTienda {
    soatGratis: boolean;  // Seguro vehicular SOAT gratis por 1 año
    transferenciaNotarialGratis: boolean;
    cuotaInicialPromocional: boolean;
    garantiaMeses: number; // Garantía en meses
    
  }
  
  export interface Promocion {
    id: string;
    nombre: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    descuento: number; // Porcentaje de descuento
  }  