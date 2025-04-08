
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
    fichaTecnica: FichaDeCaracteristicas[]; // Lista de características técnicas
    caracteristicasTienda: CaracteristicasTienda[];
    promociones: Promocion[];
  }
  
  export interface FichaDeCaracteristicas {
    cilindrada: String; // Cilindrada en cc
    potencia: string; // Potencia en hp
    torque: string; // Torque en Nm
    tipoDeIgnicion: string; // Tipo de encendido (electrónico, manual, etc.)
    capacidoadTanque: string; // Capacidad del tanque de combustible en litros
    rendimientoDelCombustible: string; // Rendimiento en km/litro
    suspensionDelantera: string; // Tipo de suspensión delantera (telescópica, invertida, etc.)
    suspensionTrasera: string; // Tipo de suspensión trasera (monoamortiguador, doble, etc.)
    trnasmision: string; // Tipo de transmisión (manual, automática, etc.)
    velocidadMaxima: string; // Velocidad máxima en km/h
    pesoTotal: string; // Peso total en kg
    dimenciones: string; // Dimensiones (largo x ancho x alto) en mm
    frenosDelanteros: string; // Tipo de frenos delanteros (disco, tambor, etc.)
    frenosTraseros: string; // Tipo de frenos traseros (disco, tambor, etc.)
  }

  export interface iconosTienda {
    nombre:string;
    iconoUrl?:string; // URL del icono
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
    codigoPromocional: string; // Código promocional para aplicar el descuento
  }  