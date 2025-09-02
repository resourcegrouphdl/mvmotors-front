import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../model/cliente';
import { Referencia } from '../../model/referencia';
import { Router } from '@angular/router';
import { VehiculoSolicitado } from '../../model/vehiculo-solicitado';
import { SolicitudDeCredito } from '../../model/solicitud-de-credito';
import { MarcaMoto, MarcasMotosArray } from '../../model/enums';
import { FirebaseFotmularioService } from '../../serivices/firebase-fotmulario.service';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {
    this.generarAniosDisponibles();
    this.inicializarFormularios();
  }

  ngOnInit(): void {
    // Ya se inicializa en el constructor, evitamos duplicar
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
    }
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
    
    // Archivos obligatorios para el fiador
    const archivosFiadorObligatorios = ['fiadorSelfie', 'fiadorDniFrente', 'fiadorDniReverso'];
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
    }
  }

  getArchivosFiadorSubidos(): Array<{nombre: string, archivo: File}> {
    return Object.entries(this.archivosFiadorSeleccionados).map(([nombre, archivo]) => ({
      nombre: this.getNombreAmigableArchivoFiador(nombre),
      archivo
    }));
  }

  private getNombreAmigableArchivoFiador(tipo: string): string {
    const nombres: {[key: string]: string} = {
      'fiadorSelfie': 'Selfie del Fiador',
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

  // =============== BÚSQUEDA DE CLIENTES ===============

  async buscarClienteExistente(): Promise<void> {
    const documentNumber = this.formTitular.get('documentNumber')?.value;
    if (documentNumber && documentNumber.length >= 8) {
      try {
        this.cargando = true;
        this.mensajeCarga = 'Buscando cliente...';
        
        const cliente = await this.firebaseService.buscarClientePorDNI(documentNumber);
        
        if (cliente) {
          this.clienteExistente = cliente;
          // Rellenar formulario con datos existentes
          this.formTitular.patchValue(cliente);
        } else {
          this.clienteExistente = null;
        }
      } catch (error) {
        console.error('Error al buscar cliente:', error);
        alert('Error al buscar el cliente. Intente nuevamente.');
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
        this.mensajeCarga = 'Buscando fiador...';
        
        const fiador = await this.firebaseService.buscarClientePorDNI(documentNumber);
        
        if (fiador) {
          // Rellenar formulario con datos existentes
          this.formFiador.patchValue(fiador);
        }
      } catch (error) {
        console.error('Error al buscar fiador:', error);
        alert('Error al buscar el fiador. Intente nuevamente.');
      } finally {
        this.cargando = false;
        this.mensajeCarga = '';
      }
    }
  }

  // =============== MANEJO DE REFERENCIAS ===============

  getReferenciasFormArray(): FormArray {
    return this.formReferencias.get('referencias') as FormArray;
  }

  agregarReferencia(): void {
    if (this.getReferenciasFormArray().length < 3) {
      this.getReferenciasFormArray().push(this.crearReferenciaFormGroup());
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

  cerrarModal(): void {
    this.mostrarModalExito = false;
    this.router.navigate(['/dashboard']);
  }
}