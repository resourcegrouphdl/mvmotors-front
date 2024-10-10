import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormTitularComponent } from '../form-titular/form-titular.component';
import { FormFiadorComponent } from '../form-fiador/form-fiador.component';
import { IProvincias, Iregiones, PERU } from '../data-acces/peruregions';

import { initFlowbite } from 'flowbite';
import { error } from 'console';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormTitularComponent,
    FormFiadorComponent,
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent implements OnInit {
  currentSection: number = 1;

  isUploading = false;
  isUploaded = false;
  uploadProgress: Observable<number> = of(0);
  private storage :Storage = inject( Storage); 
  formularioCliente: FormGroup;

  peruRegions: Iregiones[] = PERU;
  provincias: IProvincias[] = [];
  distritos: string[] = [];

  selectedDepartamento: string = '';
  selectedProvincia: string = '';
  selectedDistrito: string = '';
  selectedRadioButtons: string = '';

  //imagenes

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  downloadURL: string | null = null;



  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.formularioCliente = this.fb.group({
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
      licenciaConducir: ['', Validators.minLength(3)],
      //-- seccion de fotografias
      serlfieURL: ['', (Validators.required, Validators.minLength(3))],
      dniFrenteuRL: ['', (Validators.required, Validators.minLength(3))],
      dniReversoURL: ['', (Validators.required, Validators.minLength(3))],
      reciboDeServicioURL: ['', (Validators.required, Validators.minLength(3))],
      licConducirFrenteURL: [
        '',
        (Validators.required, Validators.minLength(3)),
      ],
      licConducirReversoURL: [
        '',
        (Validators.required, Validators.minLength(3)),
      ],
      fotoCasaURL: ['', (Validators.required, Validators.minLength(3))],

      formularioFiador: this.fb.group({
        documentTypeFiafor: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        documentNumberFiador: [
          '',
          (Validators.required, Validators.minLength(5)),
        ],
        nombreFiador: ['', (Validators.required, Validators.minLength(5))],
        estadoCivilFiador: ['', (Validators.required, Validators.minLength(3))],
        emailFiador: ['', (Validators.required, Validators.email)],
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
        fechaNacimiento: ['', (Validators.required, Validators.minLength(3))],

        //-- seccion de fotografias

        dniFrenteuRLfiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        dniReversoURLfiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        reciboDeServicioURLfiador: [
          '',
          (Validators.required, Validators.minLength(3)),
        ],
        fotoCasaURLfiador: ['', (Validators.required, Validators.minLength(3))],
      }),

      formularioVehiculo: this.fb.group({
        priReferenciaTitular: [
          '',
          (Validators.required, Validators.minLength(5)),
        ],
        segReferenciaTitular: [
          '',
          (Validators.required, Validators.minLength(5)),
        ],
        TerReferenciaTitular: [
          '',
          (Validators.required, Validators.minLength(5)),
        ],

        marcaVehiculo: ['', (Validators.required, Validators.minLength(3))],
        modeloVehiculo: ['', (Validators.required, Validators.minLength(3))],
        colorVehiculo: ['', (Validators.required, Validators.minLength(3))],

        inicialVehiculo: ['', (Validators.required, Validators.minLength(3))],
        precioVehiculo: ['', (Validators.required, Validators.minLength(3))],
        cuotaVehiculo: ['', (Validators.required, Validators.minLength(3))],
        plazoVehiculo: ['', (Validators.required, Validators.minLength(3))],

        nombreDelVendedor: ['', (Validators.required, Validators.minLength(3))],
        PuntoDeVenta: ['', (Validators.required, Validators.minLength(3))],

        mensajeOpcional: ['', (Validators.required, Validators.minLength(3))],
      }),
    });
  }
  ngOnInit(): void {
    initFlowbite();
    this.formularioCliente
      .get('licenciaStatus')!
      .valueChanges.subscribe((value) => {
        this.selectedRadioButtons = value;
        if (value === 'si') {
          this.formularioCliente
            .get('licenciaConducir')!
            .setValidators([Validators.required]);
        } else {
          this.formularioCliente.get('licenciaConducir')!.clearValidators();
        }
        this.formularioCliente
          .get('licenciaConducir')!
          .updateValueAndValidity();
        this.cdr.markForCheck();
      });
  }

  nextSection() {
    if (this.currentSection < 3) {
      this.currentSection++;
    }
  }

  prevSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
    }
  }

  onSubmit() {
    console.log('Form Data:');
    // Aquí puedes manejar el envío del formulario
  }

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
    }
  }

  async uploadImage(file: File){
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
          this.formularioCliente.get('serlfieURL')!.setValue(downloadURL);
          this.isUploading = false;
          this.isUploaded = true;
        });
      }
      )

  }
}
