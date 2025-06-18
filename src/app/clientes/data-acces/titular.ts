export interface Titular2{
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


export interface Titular {
  formTitular: {
    documentType: string;
    documentNumber: string;
    nombre: string;
    apellido: string;
    estadoCivil: string;
    email: string;
    fechaNacimiento: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    licenciaStatus: string;
    licenciaConducir?: string;
    serlfieURL: string;
    dniFrenteuRL: string;
    dniReversoURL: string;
    reciboDeServicioURL: string;
    licConducirFrenteURL?: string;
    licConducirReversoURL?: string;
    fotoCasaURL: string;
  };
  formularioFiador: {
    documentTypeFiador: string;
    documentNumberFiador: string;
    nombreFiador: string;
    apellidoFiador: string;
    estadoCivilFiador: string;
    emailFiador: string;
    fechaNacimientoFiador: string;
    departamentoFiador: string;
    provinciaFiador: string;
    distritoFiador: string;
    direccionFiador: string;
    telefonoPriFiador: string;
    telefonoSegFiador?: string;
    dniFrenteuRLfiador: string;
    dniReversoURLfiador: string;
    fotoCasaURLfiador: string;
  };
  formularioVehiculo: {
    priNombreReferenciaTitular: string;
    priApellidoReferenciaTitular: string;
    priTelefonoReferenciaTitular: string;
    priParentescoReferenciaTitular: string;
    segNombreReferenciaTitular: string;
    segApellidoReferenciaTitular: string;
    segTelefonoReferenciaTitular: string;
    segParentescoReferenciaTitular: string;
    terNombreReferenciaTitular: string;
    terApellidoReferenciaTitular: string;
    terTelefonoReferenciaTitular: string;
    terParentescoReferenciaTitular: string;
    marcaVehiculo: string;
    modeloVehiculo: string;
    colorVehiculo: string;
    precioCompraMoto: string;
    inicialVehiculo: string;
    numeroQuincenas: string;
    montotDeLaCuota: string;
    nombreDelVendedor: string;
    puntoDeVenta: string;
    mensajeOpcional: string;
  };
}