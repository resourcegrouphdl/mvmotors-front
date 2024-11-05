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