export interface MotorcycleModel {
    id: string;                // Identificador único de la motocicleta
    name: string;              // Nombre o modelo de la motocicleta
    brand: string;             // Marca de la motocicleta
    price: number;             // Precio de la motocicleta
    description: string;       // Descripción detallada
    engine: string;            // Tipo de motor (ejemplo: "V-twin", "Single-cylinder")
    power: number;             // Potencia en caballos de fuerza (HP)
    weight: number;            // Peso de la motocicleta en kg
    maxSpeed: number;          // Velocidad máxima en km/h
    fuelType: string;          // Tipo de combustible (ejemplo: "Gasolina", "Eléctrico")
    year: number;              // Año de fabricación
    color: string;             // Color de la motocicleta
    images: string[];          // Array de URLs de las imágenes de la motocicleta
    features: string[];        // Características adicionales (ejemplo: "ABS", "Bluetooth")
    availableStock: number;    // Cantidad disponible en stock
  }

  export interface Motocicleta {
    id: string;
    marca: string;
    modelo: string;
    categoria: string; // Ejemplo: "Deportiva", "Cruiser", "Touring"
    año: number;
    precio: number;
    stockDisponible: number; // Cantidad en inventario
    imagenPrincipal: string; // URL de imagen principal
    imagenesAdicionales: string[]; // Lista de imágenes desde distintos ángulos
    descripcion: string;
    especificaciones: EspecificacionesTecnicas;
    caracteristicasEspeciales: CaracteristicasEspeciales;
    promociones: Promocion[];
  }
  
  export interface EspecificacionesTecnicas {
    id: string;
    motor: string;
    cilindrada: number;
    tipoCombustible: string;
    peso: number;
    velocidadMaxima: number;
  }
  
  export interface CaracteristicasEspeciales {
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