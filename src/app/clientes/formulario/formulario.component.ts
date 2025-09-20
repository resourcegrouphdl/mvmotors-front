import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgIf,NgClass,NgFor } from '@angular/common';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { IProvincias, Iregiones, PERU } from '../data-acces/peruregions';
import { initFlowbite } from 'flowbite';
import { Observable, of } from 'rxjs';
import { FormserviceService } from '../data-acces/services/formservice.service';
import { IModelos, IMotos, MOTOS } from '../data-acces/motos';
import { toast } from 'ngx-sonner';
import 'flowbite';
import { StorageService } from '../service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',

})
export class FormularioComponent implements OnInit {
  currentSection: number = 1;
  isModalOpen : boolean = false;
  archivosSeleccionados: File[] = [];
  router = inject(Router);

  documentTypes = [
    { value: 'dni', label: 'Doc Nac Identidad' },
    { value: 'CA',  label: 'Carnet De Extranjeria' },
  ];

  stadoCivil = [
    { value: 'soltero', label: 'soltero' },
    { value: 'casado',  label: 'casado' },
  ];

  isUploading = false;
  isUploaded = false;
  uploadProgress: Observable<number> = of(0);
  private storage :Storage = inject( Storage);
  formularioCliente: FormGroup;

  peruRegions: Iregiones[] = PERU;
  provincias: IProvincias[] = [];
  distritos: string[] = [];

  motocicletaMarcas: IMotos[] = MOTOS;
  motocicletaModelos: IModelos[] = [];
  motocicletaColores: string[] = [];

  selectedDepartamento: string = '';
  selectedProvincia: string = '';
  selectedDistrito: string = '';
  selectedRadioButtons: string = '';

  //imagenes

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  downloadURL: string | null = null;

  slectedImagenDniFrente: File | null = null;
  imagePreviewDniFrente: string | ArrayBuffer | null = null;
  downloadURLDniFrente: string | null = null;

  slectedImagenDniReverso: File | null = null;
  imagePreviewDniReverso: string | ArrayBuffer | null = null;
  downloadURLDniReverso: string | null = null;

  slectedImagenReciboServicio: File | null = null;
  imagePreviewReciboServicio: string | ArrayBuffer | null = null;
  downloadURLReciboServicio: string | null = null;

  slectedImagenLicenciaFrente: File | null = null;
  imagePreviewLicenciaFrente: string | ArrayBuffer | null = null;
  downloadURLLicenciaFrente: string | null = null;

  slectedImagenLicenciaReverso: File | null = null;
  imagePreviewLicenciaReverso: string | ArrayBuffer | null = null;
  downloadURLLicenciaReverso: string | null = null;

  slectedImagenFotoCasa: File | null = null;
  imagePreviewFotoCasa: string | ArrayBuffer | null = null;
  downloadURLFotoCasa: string | null = null;

  //fiador

  slectedImagenDniFrenteFiador: File | null = null;
  imagePreviewDniFrenteFiador: string | ArrayBuffer | null = null;
  downloadURLDniFrenteFiador: string | null = null;

  slectedImagenDniReversoFiador: File | null = null;
  imagePreviewDniReversoFiador: string | ArrayBuffer | null = null;
  downloadURLDniReversoFiador: string | null = null;

  slectedImagenReciboServicioFiador: File | null = null;
  imagePreviewReciboServicioFiador: string | ArrayBuffer | null = null;
  downloadURLReciboServicioFiador: string | null = null;

  slectedImagenFotoCasaFiador: File | null = null;
  imagePreviewFotoCasaFiador: string | ArrayBuffer | null = null;
  downloadURLFotoCasaFiador: string | null = null;


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private _formService: FormserviceService, private _storage: StorageService) {
    this.formularioCliente = this.fb.group({

      formTitular: this.fb.group({
      documentType: ['', (Validators.required, Validators.minLength(3))],
      documentNumber: ['', (Validators.required, Validators.minLength(5))],
      //linea1
      nombre: ['', (Validators.required, Validators.minLength(5))],
      apellido: ['', (Validators.required, Validators.minLength(5))],
      estadoCivil: ['', (Validators.required, Validators.minLength(3))],
      //linea2
      email: ['', (Validators.required, Validators.email)],
      fechaNacimiento: ['', (Validators.required, Validators.minLength(3))],

      departamento: ['', (Validators.required, Validators.minLength(3))],
      provincia: ['', (Validators.required, Validators.minLength(3))],
      distrito: ['', (Validators.required, Validators.minLength(3))],

      direccion: ['', (Validators.required, Validators.minLength(3))],
      telefono1: [
        '',
        (Validators.required,
        Validators.minLength(8),
        Validators.maxLength(11),
        Validators.pattern('^[0-9]*$')),
      ],
      telefono2: ['', Validators.minLength(9)],

      licenciaStatus: ['', Validators.required],
      licenciaConducir: [''],
      //-- seccion de fotografias
      serlfieURL: ['', (Validators.required, Validators.minLength(3))],
      dniFrenteuRL: ['', (Validators.required, Validators.minLength(3))],
      dniReversoURL: ['', (Validators.required, Validators.minLength(3))],
      reciboDeServicioURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirFrenteURL: [ ''  ],
      licConducirReversoURL: [''],
      fotoCasaURL: ['', (Validators.required, Validators.minLength(3))],

    }),
      //fiador

      formularioFiador: this.fb.group({
        documentTypeFiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        documentNumberFiador: [
          '',
          (Validators.required, Validators.minLength(5)),
        ],
        nombreFiador: ['', (Validators.required, Validators.minLength(5))],
        apellidoFiador: ['', (Validators.required, Validators.minLength(5))],
        estadoCivilFiador: ['', (Validators.required, Validators.minLength(3))],
        emailFiador: ['', (Validators.required, Validators.email)],
        fechaNacimientoFiador: ['', (Validators.required, Validators.minLength(3))],

        departamentoFiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        provinciaFiador: ['', (Validators.required, Validators.minLength(3))],
        distritoFiador: ['', (Validators.required, Validators.minLength(3))],
        direccionFiador: ['', (Validators.required, Validators.minLength(3))],
        telefonoPriFiador: [
          '',
          (Validators.required,
          Validators.minLength(8),
          Validators.maxLength(11),
          Validators.pattern('^[0-9]*$')),
        ],
        telefonoSegFiador: ['', Validators.minLength(9)],


        //-- seccion de fotografias

        dniFrenteuRLfiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        dniReversoURLfiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],

        fotoCasaURLfiador: ['', (Validators.required, Validators.minLength(3))],
      }),

      formularioVehiculo: this.fb.group({

        //primer referencia

        priNombreReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        priApellidoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        priTelefonoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        priParentescoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],

        //segunda referencia

        segNombreReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        segApellidoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        segTelefonoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        segParentescoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],

        //tercera referencia

        terNombreReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        terApellidoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        terTelefonoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],
        terParentescoReferenciaTitular: ['',
          (Validators.required, Validators.minLength(5)),
        ],

        //vehiculo

        marcaVehiculo: ['', (Validators.required, Validators.minLength(3))],
        modeloVehiculo: ['', (Validators.required, Validators.minLength(3))],
        colorVehiculo: ['', (Validators.required, Validators.minLength(3))],

        // financiamiento
        precioCompraMoto: ['', (Validators.required, Validators.minLength(3))],
        inicialVehiculo: ['', (Validators.required, Validators.minLength(3))],
        numeroQuincenas: ['', (Validators.required, Validators.minLength(3))],
        montotDeLaCuota: ['', (Validators.required, Validators.minLength(3))],
        archivos: this.fb.array(['']),

        //vendedor

        nombreDelVendedor: ['', (Validators.required, Validators.minLength(3))],
        puntoDeVenta: ['', (Validators.required, Validators.minLength(3))],

        mensajeOpcional: ['', (Validators.required, Validators.minLength(3))],
      }),
    });
  }
  ngOnInit(): void {

    initFlowbite();

    this.formularioCliente
      .get('formTitular.licenciaStatus')!
      .valueChanges.subscribe((value) => {
        this.selectedRadioButtons = value;
        if (value === 'si') {
          this.formularioCliente
            .get('formTitular.licenciaConducir')!
            .setValidators([Validators.required]);
        } else {
          this.formularioCliente.get('formTitular.licenciaConducir')!.clearValidators();
        }
        this.formularioCliente
          .get('formTitular.licenciaConducir')!
          .updateValueAndValidity();
        this.cdr.markForCheck();
      });
  }


  irACalculadora(){
    this.router.navigate(['cliente/calculator']);
  }

  async nextSection() {
    try{
      if (this.currentSection < 3) {
      this.currentSection++;
      //this._formService.saveFormTiular(this.formularioCliente.value);
      console.log(this.formularioCliente.value);
    }
    }catch{
      console.log('error al guardar el formulario')
    }



  }

  prevSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
    }
  }

  // Método para enviar el formulario
  onSubmit() {

    this.openMOdal();



  }

  formulariCompleto(){
    try{
      console.log('Form Data:');
    this._formService.saveFormTiular(this.formularioCliente.value);
    toast('Formulario enviado con éxito' );
    this.formularioCliente.reset();
    this.cancelModal();
    this.currentSection = 1;
    // Aquí puedes manejar el envío del formulario
    } catch{
      console.log('error al guardar el formulario');

    }
  }

  openMOdal(){
    this.isModalOpen = true;
  }

  cancelModal(){
    this.isModalOpen = false;
  }




  // Métodos para manejar los cambios en los selectores de departamento, provincia y distrito

  onDepartamentoChange(departamento: string) {
    this.selectedDepartamento = departamento;
    this.provincias =
      this.peruRegions.find((d) => d.departamento === departamento)
        ?.provincias || [];
    this.distritos = []; // Reiniciar distritos cuando se cambia de departamento
    this.selectedProvincia = '';
  }

  onProvinciaChange(provincia: string) {
    this.selectedProvincia = provincia;
    this.distritos =
      this.provincias.find((p) => p.provincia === provincia)?.distritos || [];
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
      this.uploadImage(this.selectedImage,'formTitular.serlfieURL');
    }
  }

  onDniSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenDniFrente = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewDniFrente = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenDniFrente);
      this.uploadImage(this.slectedImagenDniFrente,'formTitular.dniFrenteuRL');
    }
  }

  onDniReversoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenDniReverso = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewDniReverso = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenDniReverso);
      this.uploadImage(this.slectedImagenDniReverso,'formTitular.dniReversoURL');
    }
  }

  onReciboSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenReciboServicio = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewReciboServicio = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenReciboServicio);
      this.uploadImage(this.slectedImagenReciboServicio,'formTitular.reciboDeServicioURL');
    }
  }

  onFachadaSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenFotoCasa = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewFotoCasa = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenFotoCasa);
      this.uploadImage(this.slectedImagenFotoCasa,'formTitular.fotoCasaURL');
    }
  }

  onLicFrenteSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenLicenciaFrente = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewLicenciaFrente = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenLicenciaFrente);
      this.uploadImage(this.slectedImagenLicenciaFrente,'formTitular.licConducirFrenteURL');
    }
  }


  onLicFrenteRevereso(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenLicenciaReverso = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewLicenciaReverso = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenLicenciaReverso);

      this.uploadImage(this.slectedImagenLicenciaReverso,'formTitular.licConducirReversoURL');

    }


  }









  async uploadImage(file: File, campo: string) {
      this.isUploading = true;
      const filePath = `images/${Date.now()}_${file}`; // Ruta en el storage


      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',(onSnapshot)=>{
        this.uploadProgress = of((onSnapshot.bytesTransferred / onSnapshot.totalBytes) * 100);

        switch (onSnapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }



      }
      ,(error)=>{
        console.log('error',error);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.formularioCliente.get(campo)!.setValue(downloadURL);
          this.isUploading = false;
          this.isUploaded = true;
        });
      }
      )

  }


  // secion del fiador

  onDniFiadorSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenDniFrenteFiador = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewDniFrenteFiador = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenDniFrenteFiador);
      this.uploadImage(this.slectedImagenDniFrenteFiador,'formularioFiador.dniFrenteuRLfiador');
    }
  }

  onDniFiadorReversoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenDniReversoFiador = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewDniReversoFiador = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenDniReversoFiador);
      this.uploadImage(this.slectedImagenDniReversoFiador,'formularioFiador.dniReversoURLfiador');
    }
  }

  onReciboFiadorSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenReciboServicioFiador = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewReciboServicioFiador = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenReciboServicioFiador);
      this.uploadImage(this.slectedImagenReciboServicioFiador,'formularioFiador.reciboDeServicioURLfiador');
    }
  }

  onFachadaFiadorSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.slectedImagenFotoCasaFiador = fileInput.files[0];

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewFotoCasaFiador = reader.result;
      };
      reader.readAsDataURL(this.slectedImagenFotoCasaFiador);
      this.uploadImage(this.slectedImagenFotoCasaFiador,'formularioFiador.fotoCasaURLfiador');
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    const archivosValidos: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validar tipo de archivo
      if (this.esArchivoValido(file)) {
        // Validar tamaño (máximo 10MB por archivo)
        if (file.size <= 10 * 1024 * 1024) {
          archivosValidos.push(file);
        } else {
          alert(`El archivo "${file.name}" es demasiado grande. Máximo 10MB por archivo.`);
        }
      } else {
        alert(`El archivo "${file.name}" no es válido. Solo se permiten PDF y JPG.`);
      }
    }

    const uploadPromises = archivosValidos.map(archivo => 
    this._storage.subirConProgreso(archivo).toPromise()
  );

  Promise.all(uploadPromises).then(results => {
    const urls = results.map(result => result?.url).filter(url => url);
    
    // Obtener el FormArray
    const archivosFormArray = this.formularioCliente.get('formularioVehiculo.archivos') as FormArray;
    
    // Agregar las nuevas URLs al FormArray
    urls.forEach(url => {
      archivosFormArray.push(this.fb.control(url));
    });

    // Actualizar la lista visual de archivos
    this.archivosSeleccionados = [
      ...this.archivosSeleccionados,
      ...archivosValidos
    ];
  }).catch(error => {
    console.error('Error al subir archivos:', error);
    toast.error('Error al subir los archivos');
  });

  // Limpiar el input
  event.target.value = '';
}



  private esArchivoValido(file: File): boolean {
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg'];
    return tiposPermitidos.includes(file.type);
  }

  // Eliminar archivo de la lista
  eliminarArchivo(index: number): void {
  const archivosFormArray = this.formularioCliente.get('formularioVehiculo.archivos') as FormArray;
  
  // Eliminar del FormArray
  archivosFormArray.removeAt(index);
  
  // Eliminar de la lista visual
  this.archivosSeleccionados.splice(index, 1);
}

  // Formatear el tamaño del archivo para mostrar
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


}
