export interface Titular {
  documentType: string;
  documentNumber: string;
  //linea1
  nombre: string;
  apellido: string;
  estadoCivil: string;
  //linea2
  email: string;
  fechaNacimiento: string;

  departamento: string;
  provincia: string;
  distrito: string;

  direccion: string;
  telefono1: string;
  telefono2: string;

  licenciaStatus: string;
  licenciaConducir: string;
  //-- seccion de fotografias
  serlfieURL: string;
  dniFrenteuRL: string;
  dniReversoURL: string;
  reciboDeServicioURL: string;
  licConducirFrenteURL: string;
  licConducirReversoURL: string;
  fotoCasaURL: string;

  //fiador

  documentTypeFiafor: string;
  documentNumberFiador: string;
  nombreFiador: string;
  estadoCivilFiador: string;
  emailFiador: string;
  departamentoFiador: string;
  provinciaFiador: string;
  distritoFiador: string;
  direccionFiador: string;
  telefonoPriFiador: string;
  telefonoSegFiador: string;
  fechaNacimientoFiador: string;

  //-- seccion de fotografias

  dniFrenteuRLfiador: string;
  dniReversoURLfiador: string;
  reciboDeServicioURLfiador: string;
  fotoCasaURLfiador: string;

  formularioVehiculo: string;
  priReferenciaTitular: string;
  segReferenciaTitular: string;
  TerReferenciaTitular: string;

  marcaVehiculo: string;
  modeloVehiculo: string;
  colorVehiculo: string;

  inicialVehiculo: string;
  precioVehiculo: string;
  cuotaVehiculo: string;
  plazoVehiculo: string;

  nombreDelVendedor: string;
  PuntoDeVenta: string;

  mensajeOpcional: string;
}
