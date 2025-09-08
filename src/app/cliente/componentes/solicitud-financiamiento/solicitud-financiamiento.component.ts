import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../model/cliente';
import { Referencia } from '../../model/referencia';
import { Router } from '@angular/router';
import { VehiculoSolicitado } from '../../model/vehiculo-solicitado';
import { SolicitudDeCredito } from '../../model/solicitud-de-credito';
import { MarcaMoto, MarcasMotosArray } from '../../model/enums';
import { FirebaseFotmularioService } from '../../serivices/firebase-fotmulario.service';
import { CommonModule } from '@angular/common';
import { ServiciosExternosService } from '../../../acces-data-services/servicios-externos.service';
import { AuthServiceService } from '../../../acces-data-services/auth-service.service';
import { BaseUser } from '../../../models/model-auth';

export interface FormularioEstado {
  paso: number;
  datosCliente: Partial<Cliente>;
  datosFiador: Partial<Cliente>;
  referencias: Referencia[];
  vehiculo: Partial<VehiculoSolicitado>;
  solicitud: Partial<SolicitudDeCredito>;
  archivosSubidos: { [key: string]: File };
  archivosFiadorSubidos?: { [key: string]: File }; // Nueva propiedad
}

export const DEPARTAMENTOS_PERU = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

@Component({
  selector: 'app-solicitud-financiamiento',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './solicitud-financiamiento.component.html',
  styleUrl: './solicitud-financiamiento.component.css'
})
export class SolicitudFinanciamientoComponent implements OnInit {
  reniec = inject(ServiciosExternosService);
  authService = inject(AuthServiceService);
  

  consultandoDNI: boolean = false;
  consultandoDNIFiador: boolean = false;
  ultimaConsultaDNI: string = '';
  ultimaConsultaDNIFiador: string = '';

  // Timer para debounce
  private dniTimer: any;
  private dniFiadorTimer: any;


  // Formularios reactivos
  formTitular!: FormGroup;
  formFiador!: FormGroup;
  formVehiculo!: FormGroup;
  formSolicitud!: FormGroup;
  formReferencias!: FormGroup;

  // Estado del componente
  pasoActual: number = 1;
  totalPasos: number = 8;
  cargando: boolean = false;
  mensajeCarga: string = '';
  
  // Datos
  departamentos = DEPARTAMENTOS_PERU;
  marcasMotos = MarcasMotosArray;
  aniosDisponibles: number[] = [];

  
  // Archivos
  archivosSeleccionados: { [key: string]: File } = {};
  archivosFiadorSeleccionados: { [key: string]: File } = {};
  // Agregar estas propiedades para los previews
  archivosPreview: { [key: string]: string | null } = {};
  archivosFiadorPreview: { [key: string]: string | null } = {};
  
  // Cliente existente
  clienteExistente: Cliente | null = null;
  
  // Fiador
  requiereFiador: boolean = false;
  
  // Licencia
  mostrarNumeroLicencia: boolean = false;
  
  // Financiamiento
  montoCuotaCalculado: number = 0;
  montoFinanciar: number = 0;
  mostrarResumen: boolean = false;
  
  // Modal y navegación
  mostrarModalExito: boolean = false;
  numeroSolicitud: string = '';
  aceptaTerminos: boolean = false;

  usuarioActivo: BaseUser | null = null;
  idTiendaVendedor: string = this.getIdTienda();

  // Pasos
  pasos: string[] = [
    'Titular',           // Paso 1
    'Archivos Titular',  // Paso 2  
    'Fiador/Aval',       // Paso 3
    'Archivos Fiador',   // Paso 4
    'Referencias',       // Paso 5
    'Vehículo',          // Paso 6
    'Financiamiento',    // Paso 7
    'Revisión'           // Paso 8
  ];
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseFotmularioService,
    private router: Router,
  ) {
    this.generarAniosDisponibles();
    this.inicializarFormularios();
    this.configurarEscuchasDNI();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.setVendedorInfo(this.usuarioActivo!);
    
    
    
    // Nota: Si el usuario no se carga de inmediato, considera suscribirte a `authService.currentUser$` para recibir los datos de forma asíncrona.
  }

  private inicializarFormularios(): void {
    // Formulario del titular
    this.formTitular = this.fb.group({
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(8)]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: [''],
      direccion: ['', Validators.required],
      telefono1: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      telefono2: ['', Validators.pattern(/^[0-9]{9}$/)],
      ocupacion: ['', Validators.required],
      rangoIngresos: ['', Validators.required],
      tipoVivienda: ['', Validators.required],
      licenciaConducir: ['', Validators.required],
      numeroLicencia: ['']
    });

    // Formulario del fiador
    this.formFiador = this.fb.group({
      documentType: ['DNI'],
      documentNumber: [''],
      nombres: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      estadoCivil: [''],
      email: ['', Validators.email],
      fechaNacimiento: [''],
      departamento: [''],
      provincia: [''],
      distrito: [''],
      direccion: [''],
      telefono1: [''],
      telefono2: ['']
    });

    // Formulario de referencias
    this.formReferencias = this.fb.group({
      referencias: this.fb.array([
        this.crearReferenciaFormGroup(),
        this.crearReferenciaFormGroup()
      ])
    });

    // Formulario del vehículo
    this.formVehiculo = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      anio: ['', Validators.required]
    });

    // Formulario de la solicitud
    this.formSolicitud = this.fb.group({
      precioCompraMoto: ['', [Validators.required, Validators.min(1000)]],
      inicial: ['', [Validators.required, Validators.min(0)]],
      plazoQuincenas: ['', Validators.required],
      vendedorId: ['', Validators.required],
      vendedorNombre: ['', Validators.required],
      vendedorTienda: ['', Validators.required],
      mensajeOpcional: ['']
    });
  }

  private generarAniosDisponibles(): void {
    const anioActual = new Date().getFullYear();
    this.aniosDisponibles = [];
    for (let i = anioActual; i >= anioActual - 10; i--) {
      this.aniosDisponibles.push(i);
    }
  }

  private crearReferenciaFormGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      parentesco: ['', Validators.required]
    });
  }

  // =============== CONFIGURAR ESCUCHAS DE DNI ===============

  private configurarEscuchasDNI(): void {
    // Escucha cambios en DNI del titular
    this.formTitular.get('documentNumber')?.valueChanges.subscribe(value => {
      this.onDNIChange(value, 'titular');
    });

    // Escucha cambios en DNI del fiador
    this.formFiador.get('documentNumber')?.valueChanges.subscribe(value => {
      this.onDNIChange(value, 'fiador');
    });
  }
  private onDNIChange(dni: string, tipo: 'titular' | 'fiador'): void {
    // Limpiar timer anterior
    if (tipo === 'titular') {
      clearTimeout(this.dniTimer);
    } else {
      clearTimeout(this.dniFiadorTimer);
    }

    // Validar que sea DNI y tenga 8 dígitos
    if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
      // Limpiar datos si no es válido
      this.limpiarDatosConsulta(tipo);
      return;
    }

    // Verificar que no sea la misma consulta
    const ultimaConsulta = tipo === 'titular' ? this.ultimaConsultaDNI : this.ultimaConsultaDNIFiador;
    if (dni === ultimaConsulta) {
      return;
    }

    // Configurar debounce de 500ms
    const timer = setTimeout(() => {
      this.consultarDNI(dni, tipo);
    }, 500);

    if (tipo === 'titular') {
      this.dniTimer = timer;
    } else {
      this.dniFiadorTimer = timer;
    }
  }
  
   private consultarDNI(dni: string, tipo: 'titular' | 'fiador'): void {
    // Verificar tipo de documento antes de consultar
    const tipoDoc = tipo === 'titular' 
      ? this.formTitular.get('documentType')?.value 
      : this.formFiador.get('documentType')?.value;
    
    if (tipoDoc !== 'DNI') {
      return; // Solo consultar si es DNI
    }

    // Establecer estado de carga
    if (tipo === 'titular') {
      this.consultandoDNI = true;
      this.mensajeCarga = 'Consultando datos en RENIEC...';
    } else {
      this.consultandoDNIFiador = true;
      this.mensajeCarga = 'Consultando datos del fiador en RENIEC...';
    }

    // Realizar consulta
    this.reniec.consultarDNI(dni).subscribe({
      next: (data) => {
        this.onConsultaExitosa(data, tipo, dni);
      },
      error: (error) => {
        this.onConsultaError(error, tipo, dni);
      },
      complete: () => {
        // Limpiar estado de carga
        if (tipo === 'titular') {
          this.consultandoDNI = false;
        } else {
          this.consultandoDNIFiador = false;
        }
        this.mensajeCarga = '';
      }
    });
  }

  // =============== MANEJO DE RESPUESTA EXITOSA ===============

  private onConsultaExitosa(data: any, tipo: 'titular' | 'fiador', dni: string): void {
    const form = tipo === 'titular' ? this.formTitular : this.formFiador;
    
    // Actualizar datos en el formulario
    form.patchValue({
      nombres: this.capitalizarNombres(data.nombres || ''),
      apellidoPaterno: this.capitalizarNombres(data.apellidoPaterno || ''),
      apellidoMaterno: this.capitalizarNombres(data.apellidoMaterno || '')
    });

    // Guardar última consulta exitosa
    if (tipo === 'titular') {
      this.ultimaConsultaDNI = dni;
      this.clienteExistente = null; // Limpiar cliente existente si había
      console.log('Datos del titular consultados:', data);
    } else {
      this.ultimaConsultaDNIFiador = dni;
    }

    // Mostrar mensaje de éxito
    this.mostrarMensaje(`Datos de ${tipo} consultados exitosamente en RENIEC`, 'success');
  }

  // =============== MANEJO DE ERROR EN CONSULTA ===============

  private onConsultaError(error: any, tipo: 'titular' | 'fiador', dni: string): void {
    console.error(`Error al consultar DNI ${tipo}:`, error);
    
    // Limpiar datos si hay error
    this.limpiarDatosConsulta(tipo);
    
    // Mostrar mensaje de error específico
    let mensajeError = 'Error al consultar DNI';
    
    if (error.status === 404) {
      mensajeError = 'DNI no encontrado en RENIEC';
    } else if (error.status === 500) {
      mensajeError = 'Servicio RENIEC no disponible temporalmente';
    } else if (error.status === 0) {
      mensajeError = 'Sin conexión a internet';
    }

    this.mostrarMensaje(`${mensajeError} para ${tipo}`, 'error');
  }

  // =============== MÉTODOS DE UTILIDAD ===============

  private limpiarDatosConsulta(tipo: 'titular' | 'fiador'): void {
    const form = tipo === 'titular' ? this.formTitular : this.formFiador;
    
    // Solo limpiar si los campos están vacíos o fueron llenados por consulta anterior
    const nombres = form.get('nombres')?.value;
    const apellidoPaterno = form.get('apellidoPaterno')?.value;
    const apellidoMaterno = form.get('apellidoMaterno')?.value;

    // Limpiar solo si parece que fueron llenados automáticamente
    if (nombres || apellidoPaterno || apellidoMaterno) {
      form.patchValue({
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: ''
      });
    }

    // Limpiar última consulta
    if (tipo === 'titular') {
      this.ultimaConsultaDNI = '';
    } else {
      this.ultimaConsultaDNIFiador = '';
    }
  }

  private capitalizarNombres(texto: string): string {
    return texto.toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info'): void {
    // Implementar tu sistema de notificaciones aquí
    // Por ejemplo, usando toastr, sweet alert, o tu propio sistema
    if (tipo === 'success') {
      // toast.success(mensaje);
      console.log(`✅ ${mensaje}`);
    } else if (tipo === 'error') {
      // toast.error(mensaje);
      console.error(`❌ ${mensaje}`);
    } else {
      // toast.info(mensaje);
      console.info(`ℹ️ ${mensaje}`);
    }
  }

  // =============== MÉTODOS PÚBLICOS PARA CONSULTA MANUAL ===============

  consultarDNITitular(): void {
    const dni = this.formTitular.get('documentNumber')?.value;
    if (dni && dni.length === 8 && /^\d+$/.test(dni)) {
      this.consultarDNI(dni, 'titular');
    } else {
      this.mostrarMensaje('Ingrese un DNI válido de 8 dígitos', 'error');
    }
  }

  consultarDNIFiador(): void {
    const dni = this.formFiador.get('documentNumber')?.value;
    if (dni && dni.length === 8 && /^\d+$/.test(dni)) {
      this.consultarDNI(dni, 'fiador');
    } else {
      this.mostrarMensaje('Ingrese un DNI válido de 8 dígitos para el fiador', 'error');
    }
  }

  // =============== ACTUALIZAR MÉTODOS EXISTENTES ===============

  async buscarClienteExistente(): Promise<void> {
    const documentNumber = this.formTitular.get('documentNumber')?.value;
    if (documentNumber && documentNumber.length >= 8) {
      try {
        this.cargando = true;
        this.mensajeCarga = 'Buscando cliente en base de datos...';
        
        const cliente = await this.firebaseService.buscarClientePorDNI(documentNumber);
        
        if (cliente) {
          this.clienteExistente = cliente;
          this.formTitular.patchValue(cliente);
          this.mostrarMensaje('Cliente encontrado en base de datos', 'success');
        } else {
          this.clienteExistente = null;
          // Si no encuentra en BD y es DNI válido, consultar RENIEC automáticamente
          if (documentNumber.length === 8 && /^\d+$/.test(documentNumber)) {
            this.consultarDNI(documentNumber, 'titular');
          }
        }
      } catch (error) {
        console.error('Error al buscar cliente:', error);
        this.mostrarMensaje('Error al buscar el cliente en base de datos', 'error');
      } finally {
        this.cargando = false;
        this.mensajeCarga = '';
      }
    }
  }

  async buscarFiadorExistente(): Promise<void> {
    const documentNumber = this.formFiador.get('documentNumber')?.value;
    if (documentNumber && documentNumber.length >= 8) {
      try {
        this.cargando = true;
        this.mensajeCarga = 'Buscando fiador en base de datos...';
        
        const fiador = await this.firebaseService.buscarClientePorDNI(documentNumber);
        
        if (fiador) {
          this.formFiador.patchValue(fiador);
          this.mostrarMensaje('Fiador encontrado en base de datos', 'success');
        } else {
          // Si no encuentra en BD y es DNI válido, consultar RENIEC automáticamente
          if (documentNumber.length === 8 && /^\d+$/.test(documentNumber)) {
            this.consultarDNI(documentNumber, 'fiador');
          }
        }
      } catch (error) {
        console.error('Error al buscar fiador:', error);
        this.mostrarMensaje('Error al buscar el fiador en base de datos', 'error');
      } finally {
        this.cargando = false;
        this.mensajeCarga = '';
      }
    }
  }

  // =============== CLEANUP ===============

  ngOnDestroy(): void {
    // Limpiar timers al destruir componente
    if (this.dniTimer) {
      clearTimeout(this.dniTimer);
    }
    if (this.dniFiadorTimer) {
      clearTimeout(this.dniFiadorTimer);
    }
  }



  getDni(){
    this.reniec.consultarDNI(this.formTitular.get('documentNumber')?.value || '').subscribe({
      next: (data) => {
        this.formTitular.patchValue({
          nombres: data.nombres,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno
        });
      },
      error: (error) => {
        console.error('Error al consultar DNI:', error);
      }
    });
  }
  // =============== NAVEGACIÓN ===============

  get progreso(): number {
    return (this.pasoActual / this.totalPasos) * 100;
  }

  getClasePaso(paso: number): string {
    if (paso === this.pasoActual) return 'step-active';
    if (paso < this.pasoActual) return 'step-completed';
    if (!this.puedeIrAPaso(paso)) return 'step-disabled';
    return 'step-pending';
  }

  puedeIrAPaso(paso: number): boolean {
    // Solo puede ir a pasos anteriores o al siguiente si el actual es válido
    if (paso < this.pasoActual) return true;
    if (paso === this.pasoActual) return true;
    if (paso === this.pasoActual + 1) return this.puedeAvanzar();
    return false;
  }

  irAPaso(paso: number): void {
    if (this.puedeIrAPaso(paso)) {
      this.pasoActual = paso;
    }
  }

  siguientePaso(): void {
    if (this.puedeAvanzar()) {
      this.pasoActual++;
      // Hacer scroll al inicio del formulario
      this.scrollToTop();
    }
  }
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  puedeAvanzar(): boolean {
    switch (this.pasoActual) {
      case 1: // Titular
        return this.formTitular.valid;
      case 2: // Archivos Titular
        return this.validarArchivosObligatorios();
      case 3: // Fiador/Aval
        return !this.requiereFiador || this.validarFiador();
      case 4: // Archivos Fiador
        return !this.requiereFiador || this.validarArchivosFiador();
      case 5: // Referencias
        return this.validarReferencias();
      case 6: // Vehículo
        return this.formVehiculo.valid;
      case 7: // Financiamiento
        return this.formSolicitud.valid && this.montoCuotaCalculado > 0;
      case 8: // Revisión
        return this.aceptaTerminos;
      default:
        return false;
    }
  }

  // =============== VALIDACIONES ===============

  private validarArchivosObligatorios(): boolean {
    const archivosObligatorios = ['selfie', 'dniFrente', 'dniReverso', 'reciboServicio', 'fachada'];
    return archivosObligatorios.every(tipo => this.archivosSeleccionados[tipo]);
  }

  private validarReferencias(): boolean {
    const referencias = this.getReferenciasFormArray();
    return referencias.length >= 1 && referencias.controls.every(ref => ref.valid);
  }

  private validarFiador(): boolean {
    if (!this.requiereFiador) return true;
    
    const camposObligatorios = [
      'documentNumber', 'nombres', 'apellidoPaterno', 'apellidoMaterno',
      'estadoCivil', 'email', 'fechaNacimiento', 'departamento', 
      'provincia', 'direccion', 'telefono1'
    ];
    
    return camposObligatorios.every(campo => {
      const valor = this.formFiador.get(campo)?.value;
      return valor && valor.toString().trim() !== '';
    });
  }

  // =============== MANEJO DE ARCHIVOS ===============

   onFileSelected(event: any, tipoArchivo: string): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no puede ser mayor a 5MB');
        return;
      }
      
      // Validar tipo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG o PDF');
        return;
      }
      
      this.archivosSeleccionados[tipoArchivo] = file;
      
      // Generar preview si es imagen
      if (this.esImagen(file)) {
        this.generarPreview(file, tipoArchivo, 'archivosPreview');
      } else {
        // Si es PDF, limpiar el preview
        this.archivosPreview[tipoArchivo] = null;
      }
    }
  }

  getArchivosSubidos(): Array<{nombre: string, archivo: File}> {
    return Object.entries(this.archivosSeleccionados).map(([nombre, archivo]) => ({
      nombre: this.getNombreAmigableArchivo(nombre),
      archivo
    }));
  }

  private getNombreAmigableArchivo(tipo: string): string {
    const nombres: {[key: string]: string} = {
      'selfie': 'Selfie',
      'dniFrente': 'DNI Frente',
      'dniReverso': 'DNI Reverso',
      'reciboServicio': 'Recibo de Servicio',
      'fachada': 'Foto de Fachada',
      'fotoLicenciaFrente': 'Licencia Frente',
      'certificadoLaboral': 'Certificado Laboral'
    };
    return nombres[tipo] || tipo;
  }


   // =============== NUEVOS MÉTODOS PARA ARCHIVOS DEL FIADOR ===============
   private validarArchivosFiador(): boolean {
    if (!this.requiereFiador) return true;    
    // Archivos obligatorios para el fiador, según el texto informativo en el HTML.
    const archivosFiadorObligatorios = [ 'fiadorDniFrente', 'fiadorDniReverso'];
    return archivosFiadorObligatorios.every(tipo => this.archivosFiadorSeleccionados[tipo]);
  }

  onFileSelectedFiador(event: any, tipoArchivo: string): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no puede ser mayor a 5MB');
        return;
      }
      
      // Validar tipo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG o PDF');
        return;
      }
      
      this.archivosFiadorSeleccionados[tipoArchivo] = file;
      
      // Generar preview si es imagen
      if (this.esImagen(file)) {
        this.generarPreview(file, tipoArchivo, 'archivosFiadorPreview');
      } else {
        // Si es PDF, limpiar el preview
        this.archivosFiadorPreview[tipoArchivo] = null;
      }
    }
  }

   // =============== NUEVOS MÉTODOS PARA PREVIEW ===============

  private esImagen(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private generarPreview(file: File, tipoArchivo: string, tipoPreview: 'archivosPreview' | 'archivosFiadorPreview'): void {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      if (tipoPreview === 'archivosPreview') {
        this.archivosPreview[tipoArchivo] = e.target.result;
      } else {
        this.archivosFiadorPreview[tipoArchivo] = e.target.result;
      }
    };
    
    reader.readAsDataURL(file);
  }

  // =============== MÉTODOS PARA LIMPIAR ARCHIVOS ===============

  eliminarArchivo(tipoArchivo: string): void {
    delete this.archivosSeleccionados[tipoArchivo];
    delete this.archivosPreview[tipoArchivo];
  }

  eliminarArchivoFiador(tipoArchivo: string): void {
    delete this.archivosFiadorSeleccionados[tipoArchivo];
    delete this.archivosFiadorPreview[tipoArchivo];
  }

  // =============== MÉTODOS DE UTILIDAD ===============

  getFileIcon(file: File): string {
    if (file.type === 'application/pdf') {
      return '📄';
    } else if (file.type.startsWith('image/')) {
      return '🖼️';
    }
    return '📎';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getArchivosFiadorSubidos(): Array<{nombre: string, archivo: File}> {
    return Object.entries(this.archivosFiadorSeleccionados).map(([nombre, archivo]) => ({
      nombre: this.getNombreAmigableArchivoFiador(nombre),
      archivo
    }));
  }

  private getNombreAmigableArchivoFiador(tipo: string): string {
    const nombres: {[key: string]: string} = {
      'fiadorDniFrente': 'DNI Frente del Fiador',
      'fiadorDniReverso': 'DNI Reverso del Fiador',
      'fiadorReciboServicio': 'Recibo de Servicio del Fiador',
      'fiadorFachada': 'Foto de Fachada del Fiador'
    };
    return nombres[tipo] || tipo;
  }

  // =============== CAMPOS CONDICIONALES ===============

  mostrarCampoLicencia(): boolean {
    const licencia = this.formTitular.get('licenciaConducir')?.value;
    return licencia === 'vigente';
  }

  mostrarCampoCertificado(): boolean {
    const ocupacion = this.formTitular.get('ocupacion')?.value;
    return ocupacion === 'dependiente';
  }

  

  

  
  // =============== MANEJO DE REFERENCIAS ===============

  getReferenciasFormArray(): FormArray {
    return this.formReferencias.get('referencias') as FormArray;
  }

  agregarReferencia(): void {
    if (this.getReferenciasFormArray().length < 3) {              // Límite de 3 referencias
      this.getReferenciasFormArray().push(this.crearReferenciaFormGroup());  // Agregar nueva referencia
    }
  }

  eliminarReferencia(index: number): void {
    if (this.getReferenciasFormArray().length > 1) {
      this.getReferenciasFormArray().removeAt(index);
    }
  }

  // =============== MANEJO DEL FIADOR ===============

  toggleFiador(event: any): void {
    this.requiereFiador = event.target.checked;
    
    if (this.requiereFiador) {
      // Hacer obligatorios los campos del fiador
      const camposObligatorios = [
        'documentNumber', 'nombres', 'apellidoPaterno', 'apellidoMaterno',
        'estadoCivil', 'email', 'fechaNacimiento', 'departamento', 
        'provincia', 'direccion', 'telefono1'
      ];
      
      camposObligatorios.forEach(campo => {
        const control = this.formFiador.get(campo);
        if (control) {
          if (campo === 'email') {
            control.setValidators([Validators.required, Validators.email]);
          } else if (campo === 'telefono1') {
            control.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
          } else {
            control.setValidators([Validators.required]);
          }
        }
      });
      
      this.formFiador.updateValueAndValidity();
    } else {
      // Quitar validaciones obligatorias
      Object.keys(this.formFiador.controls).forEach(campo => {
        const control = this.formFiador.get(campo);
        if (control) {
          control.clearValidators();
          if (campo === 'email') {
            control.setValidators([Validators.email]);
          }
          control.updateValueAndValidity();
        }
      });
    }
  }

  // =============== LICENCIA DE CONDUCIR ===============

  onLicenciaChange(event: any): void {
    const valor = event.target.value;
    this.mostrarNumeroLicencia = valor === 'vigente' || valor === 'vencido';
    
    const numeroLicenciaControl = this.formTitular.get('numeroLicencia');
    if (numeroLicenciaControl) {
      if (this.mostrarNumeroLicencia) {
        numeroLicenciaControl.setValidators([Validators.required]);
      } else {
        numeroLicenciaControl.clearValidators();
        numeroLicenciaControl.setValue('');
      }
      numeroLicenciaControl.updateValueAndValidity();
    }
  }

  // =============== CÁLCULOS FINANCIEROS ===============

  calcularCuota(): void {
    const precio = this.formSolicitud.get('precioCompraMoto')?.value || 0;
    const inicial = this.formSolicitud.get('inicial')?.value || 0;
    const plazo = this.formSolicitud.get('plazoQuincenas')?.value || 0;

    if (precio > 0 && inicial >= 0 && plazo > 0) {
      this.montoFinanciar = precio - inicial;
      this.montoCuotaCalculado = this.firebaseService.calcularMontoCuota(precio, inicial, plazo);
      this.mostrarResumen = true;
      
      // Actualizar el campo de cuota en el formulario
      this.formSolicitud.patchValue({
        montoCuota: this.montoCuotaCalculado
      });
    } else {
      this.montoCuotaCalculado = 0;
      this.montoFinanciar = 0;
      this.mostrarResumen = false;
    }
  }

  // Obtener nombre del tipo de archivo
getFileTypeName(file: File): string {
  if (!file) return '';
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  const type = file.type.toLowerCase();
  
  if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return 'Imagen';
  }
  
  if (type.includes('pdf') || extension === 'pdf') {
    return 'PDF';
  }
  
  if (type.includes('word') || type.includes('document') || ['doc', 'docx'].includes(extension || '')) {
    return 'Word';
  }
  
  if (type.includes('sheet') || type.includes('excel') || ['xls', 'xlsx'].includes(extension || '')) {
    return 'Excel';
  }
  
  if (type.includes('text') || extension === 'txt') {
    return 'Texto';
  }
  
  return 'Documento';
}

  // =============== ENVÍO Y GUARDADO ===============

   async guardarBorrador(): Promise<void> {
    try {
      this.cargando = true;
      this.mensajeCarga = 'Guardando borrador...';
      
      const formularioEstado: FormularioEstado = {
        paso: this.pasoActual,
        datosCliente: this.formTitular.value,
        datosFiador: this.requiereFiador ? this.formFiador.value : {},
        referencias: this.getReferenciasFormArray().value,
        vehiculo: this.formVehiculo.value,
        solicitud: {
          ...this.formSolicitud.value,
          montoCuota: this.montoCuotaCalculado
        },
        archivosSubidos: this.archivosSeleccionados,
        archivosFiadorSubidos: this.archivosFiadorSeleccionados // Nueva propiedad
      };
      
      localStorage.setItem('solicitud-borrador', JSON.stringify(formularioEstado));
      alert('Borrador guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      alert('Error al guardar el borrador');
    } finally {
      this.cargando = false;
      this.mensajeCarga = '';
    }
  }

  cargarBorrador(): void {
    const borrador = localStorage.getItem('solicitud-borrador');
    if (borrador) {
      try {
        const formularioEstado: FormularioEstado = JSON.parse(borrador);
        
        // Restaurar datos de los formularios
        this.formTitular.patchValue(formularioEstado.datosCliente);
        this.formFiador.patchValue(formularioEstado.datosFiador);
        this.formVehiculo.patchValue(formularioEstado.vehiculo);
        this.formSolicitud.patchValue(formularioEstado.solicitud);
        
        // Restaurar referencias
        const referenciasArray = this.getReferenciasFormArray();
        referenciasArray.clear();
        formularioEstado.referencias.forEach(ref => {
          const group = this.fb.group({
            nombre: [ref.nombre, Validators.required],
            apellidos: [ref.apellidos, Validators.required],
            telefono: [ref.telefono, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
            parentesco: [ref.parentesco, Validators.required]
          });
          referenciasArray.push(group);
        });
        
        // Restaurar estado
        this.pasoActual = formularioEstado.paso;
        this.requiereFiador = Object.keys(formularioEstado.datosFiador).length > 0;
        this.archivosSeleccionados = formularioEstado.archivosSubidos || {};
        
        // Recalcular cuota
        this.calcularCuota();
        
        alert('Borrador cargado exitosamente');
      } catch (error) {
        console.error('Error al cargar borrador:', error);
        alert('Error al cargar el borrador');
      }
    }
  }

  puedeEnviar(): boolean {
    return this.pasoActual === 8 && // Cambiar a paso 8
           this.aceptaTerminos && 
           this.formTitular.valid && 
           this.validarArchivosObligatorios() && 
           (!this.requiereFiador || this.validarFiador()) &&
           (!this.requiereFiador || this.validarArchivosFiador()) && // Nueva validación
           this.validarReferencias() && 
           this.formVehiculo.valid && 
           this.formSolicitud.valid;
  }

  async enviarSolicitud(): Promise<void> {
    if (!this.puedeEnviar()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      this.cargando = true;
      this.mensajeCarga = 'Enviando solicitud...';

      const formularioEstado: FormularioEstado = {
        paso: this.pasoActual,
        datosCliente: {
          ...this.formTitular.value,
          tipo: 'titular'
        },
        datosFiador: this.requiereFiador ? {
          ...this.formFiador.value,
          tipo: 'fiador'
        } : {},
        referencias: this.getReferenciasFormArray().value,
        vehiculo: this.formVehiculo.value,
        solicitud: {
          ...this.formSolicitud.value,
          montoCuota: this.montoCuotaCalculado,
          vendedor: {
            id: this.formSolicitud.get('vendedorId')?.value,
            nombre: this.formSolicitud.get('vendedorNombre')?.value,
            tienda: this.formSolicitud.get('vendedorTienda')?.value
          }
        },
        archivosSubidos: this.archivosSeleccionados,
        archivosFiadorSubidos: this.archivosFiadorSeleccionados // Nueva propiedad
      };

      const solicitudId = await this.firebaseService.guardarSolicitudCompleta(formularioEstado);
      
      this.numeroSolicitud = solicitudId;
      this.mostrarModalExito = true;
      
      localStorage.removeItem('solicitud-borrador');

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud. Por favor intente nuevamente.');
    } finally {
      this.cargando = false;
      this.mensajeCarga = '';
    }
  }

  // =============== OBTENER CURRENTUSER ACTIVO  ===============

  getCurrentUser() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActivo = user;
      if (user) {
        this.idTiendaVendedor = this.getIdTienda();
        this.setVendedorInfo(user);
        
      }
    });
  
  }

  setVendedorInfo(vendedor: BaseUser): void {
    this.formSolicitud.patchValue({
      vendedorId: vendedor.uid,
      vendedorNombre: `${vendedor.firstName} ${vendedor.lastName}`,
      vendedorTienda: vendedor.storeIds || ''
    });
  }
  
  getIdTienda():string {
    const idTienda = this.authService.vendorUser$[0];
    return idTienda;
  }


  // =============== MODAL Y NAVEGACIÓN ===============
  cerrarModal(): void {
    this.mostrarModalExito = false;
    this.router.navigate(['quienes-somos/vendor/info']);
  }
}