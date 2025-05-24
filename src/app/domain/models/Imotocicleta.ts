
export interface MotocicletaProduct {
  id: string;
  marca?: string;
  modelo?: string;
  categoria?: string;
  descripcion?: string;
  fichaTecnica: fichaTecnica; //id de la ficha técnica en tra tabla
  imagen_principal?: string;
  imagenes?: string[];
  precioWeb?: string; //id del precio en la tabla de precios
  precio?: string; //id del precio en la tabla de precios
  stock?: string; //id del stock en la tabla de stock
  destacado?: string;
  fechaCreacion?: string;
  promociones?: string[]; //id de las promociones en la tabla de promociones
  precioInicial?: string; //id del precio inicial en la tabla de precios
}

export interface fichaTecnica {
  id?: string;
  motor: string;
  cilindrada: string;
  potencia: string;
  torque: string;
  combustible: string;
  tanque: string;
  rendimiento: string;
  autonomia: string;
  ruedaDelantera: string;
  ruedaTrasera: string;
  suspencionDelantera: string;
  suspencionTrasera: string;
  frenoDelantero: string;
  frenoTrasero: string;
  transmision: string;
  peso: string;
  velocidadMaxima: string;
  dimenciones: string;
  arranque:string;
}

export interface Precio {
  id?: string;
  precioBase: string;
  precioPublico: string;
  precioDescuento: string;
  precioFinanciado: string;
  precioContado: string;
}

export interface promociones {
  id?: string;
  nombre: string;
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  descuento: string; //id del descuento en la tabla de descuentos
  stock: string; //id del stock en la tabla de stock
}

